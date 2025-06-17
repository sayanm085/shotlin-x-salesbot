// AI conversation processing
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptTemplate } from 'langchain/prompts';
import dayjs from 'dayjs';
import { logger } from './logger.js';
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import { notifyAdmin } from './whatsapp.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Get conversation history
const getConversationHistory = async (phone, limit = 10) => {
  try {
    const conversation = await Conversation.findOne({ phone });
    
    if (!conversation) return "";
    
    // Get last messages
    const messages = conversation.messages
      .slice(-limit)
      .map(msg => `${msg.sender === 'lead' ? 'Customer' : 'Shotlin'}: ${msg.content}`)
      .join('\n\n');
      
    return messages;
  } catch (error) {
    logger.error('Error fetching conversation history:', error);
    return "";
  }
};

// Save message to conversation history
const saveMessage = async (phone, sender, content) => {
  try {
    let conversation = await Conversation.findOne({ phone });
    
    if (!conversation) {
      // Find lead
      const lead = await Lead.findOne({ phone });
      
      if (!lead) {
        throw new Error(`No lead found for phone ${phone}`);
      }
      
      // Create new conversation
      conversation = new Conversation({
        leadId: lead._id,
        phone,
        messages: []
      });
    }
    
    // Add message
    conversation.messages.push({
      sender,
      content,
      timestamp: new Date()
    });
    
    await conversation.save();
    return true;
  } catch (error) {
    logger.error('Error saving message:', error);
    return false;
  }
};

// Check if message requires human attention
const requiresHumanAttention = (message) => {
  // Keywords that suggest complex technical questions
  const technicalKeywords = [
    'integrate', 'integration', 'api', 'custom', 'complicated',
    'specific requirement', 'technical question', 'complex'
  ];
  
  // Keywords for call requests
  const callKeywords = [
    'call me', 'phone call', 'speak to', 'talk to someone', 
    'talk on call', 'video call', 'meeting', 'speak with', 
    'contact me', 'talk directly'
  ];
  
  // Check for technical complexity
  for (const keyword of technicalKeywords) {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      return { requires: true, reason: 'technical', keyword };
    }
  }
  
  // Check for call requests
  for (const keyword of callKeywords) {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      return { requires: true, reason: 'call_request', keyword };
    }
  }
  
  return { requires: false };
};

// Process messages with AI
export const processAIResponse = async (phone, message, lead) => {
  try {
    // Save customer message
    await saveMessage(phone, 'lead', message);
    
    // Check if message requires human attention
    const humanCheck = requiresHumanAttention(message);
    if (humanCheck.requires) {
      // Notify admin
      const notifyMessage = `⚠️ ATTENTION NEEDED: Customer ${lead.name} (${phone}) asked about "${humanCheck.keyword}". Potential deal.`;
      notifyAdmin(notifyMessage);
      
      // Return appropriate response
      let response;
      if (humanCheck.reason === 'technical') {
        response = "That's an excellent technical question. Please wait while I consult with our development team to provide you with the most accurate information. I'll get back to you shortly with a detailed answer.";
      } else if (humanCheck.reason === 'call_request') {
        response = "I'd be happy to arrange a call with our solution specialist. We have availability tomorrow at 11:00 AM or 3:00 PM IST. Would either of those times work for you? Or would you prefer a slot on another day?";
      }
      
      // Save AI response
      await saveMessage(phone, 'ai', response);
      return response;
    }
    
    // Format the conversation history
    const conversationHistory = await getConversationHistory(phone, 5);
    
    // Create system prompt
    const systemPrompt = `
You are a professional AI Sales Agent for Shotlin, a web and software development company.
Current date and time: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}

Customer Information:
Name: ${lead.name || "Customer"}
Business: ${lead.shopName || "Your Business"}
Industry: ${lead.industry || "Your Industry"}

Previous conversation:
${conversationHistory}

Important information to include:
1. Our tech stack includes React/Next.js (frontend), Express/MongoDB/PostgreSQL (backend), and React Native (mobile).
2. Domain and hosting services are outsourced, not provided directly by our company.
3. Pricing for websites starts at ₹15,000 for basic sites up to ₹30,000+ for advanced features.
4. Special features like authentication (+₹3,000), database integration (+₹4,000), and admin panels (+₹5,000) increase pricing.
5. For Indian customers (+91), pricing includes GST. For international customers, VAT applies.

Guidelines:
- Be persuasive but not pushy
- Focus on benefits, not just features
- Use confident and professional language
- If technical questions are complex, offer to consult with the team
- Follow professional sales approaches including AIDA model
- Move conversations towards deal closure

Customer's latest message: ${message}
`;
    
    // Get response from Gemini
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();
    
    // Save AI response
    await saveMessage(phone, 'ai', response);
    
    // Update lead status if still new
    if (lead.status === 'new') {
      lead.status = 'contacted';
      lead.lastContactedAt = new Date();
      await lead.save();
    }
    
    return response;
  } catch (error) {
    logger.error("Error generating AI response:", error);
    return "I apologize for the inconvenience. Our system is experiencing a technical issue. A human team member will assist you shortly.";
  }
};

// Generate follow-up message for reminders
export const generateFollowUpMessage = async (leadId, type) => {
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error(`Lead not found: ${leadId}`);
    
    let template;
    if (type === 'day1') {
      template = `
Hello ${lead.name || "there"},

I hope this message finds you well. I wanted to follow up on our conversation about your ${lead.industry || "business"} website/software needs. 

Did you have any questions I could answer for you?

Best regards,
Shotlin Team
      `;
    } else if (type === 'day6') {
      template = `
Hello ${lead.name || "there"},

I noticed we haven't been able to connect recently. I'm reaching out one final time to see if you're still interested in discussing your ${lead.industry || "business"} digital needs.

If you'd like to proceed or have any questions, please let me know. Otherwise, I'll respect your time and won't follow up further.

Best regards,
Shotlin Team
      `;
    } else {
      template = `Hello ${lead.name || "there"}, just checking in about your project. Any questions I can help with?`;
    }
    
    return template.trim();
  } catch (error) {
    logger.error('Error generating follow-up message:', error);
    return `Hello, just checking in about your project. Any questions I can help with?`;
  }
};