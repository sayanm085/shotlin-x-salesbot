// templates.js - Message & Email Templates with Dynamic Variables
import Handlebars from 'handlebars';
import dayjs from 'dayjs';

// Register custom Handlebars helpers
Handlebars.registerHelper('formatDate', (date, format = 'DD/MM/YYYY') => {
  return dayjs(date).format(format);
});

Handlebars.registerHelper('capitalize', (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
});

Handlebars.registerHelper('greeting', () => {
  const hour = dayjs().hour();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
});

// ==============================
// WhatsApp Message Templates
// ==============================

export const messageTemplates = {
  // Initial Contact Templates
  initial: {
    default: Handlebars.compile(`{{greeting}} {{name}}! 👋

I'm the AI assistant at Shotlin, a professional web & software development company. How can I help with your digital needs today?`),
    
    withBusiness: Handlebars.compile(`{{greeting}} {{name}}! 👋

I'm the AI assistant at Shotlin. I understand you run {{business}}{{#if industry}} in the {{industry}} industry{{/if}}. How can we help with your digital needs today?`)
  },

  // Industry-specific templates
  industry: {
    restaurant: Handlebars.compile(`As a restaurant business, you might benefit from:

• An attractive website with integrated menu system
• Online ordering capabilities
• Reservation management
• Mobile responsiveness for on-the-go customers

Our restaurant websites start at ₹15,000 with add-ons available for specific features.

Would you like me to explain any of these features in more detail?`),

    retail: Handlebars.compile(`For retail businesses like yours, we typically recommend:

• E-commerce enabled website with product catalog
• Inventory management integration
• Secure payment processing
• Mobile-friendly shopping experience

Our retail solutions start at ₹20,000 with additional features available.

Would you like to know more about any specific aspect?`),

    professional: Handlebars.compile(`For professional services like yours, we recommend:

• Professional portfolio website
• Client testimonial system
• Appointment booking functionality
• SEO optimization for local visibility

Our professional services websites start at ₹15,000 with customization options.

Is there a particular feature that interests you?`),

    default: Handlebars.compile(`For your {{industry}} business, we can create:

• A professional website tailored to your industry needs
• Mobile-responsive design for all devices
• Contact forms and lead capture functionality
• SEO-friendly structure for better visibility

Our websites start at ₹15,000 with additional features available.

What specific functionality would be most valuable for your business?`)
  },
  
  // Pricing templates
  pricing: {
    website: Handlebars.compile(`Our website development pricing:

• Basic Website: ₹15,000
  - Up to 5 pages
  - Mobile responsive design
  - Contact form
  - Basic SEO setup

• Standard Website: ₹25,000
  - Up to 10 pages
  - Advanced design features
  - Social media integration
  - Enhanced SEO package

• Advanced Website: ₹35,000+
  - Custom pages & functionality
  - Content management system
  - Advanced integrations
  - Performance optimization

Additional features:
• Authentication system: +₹3,000
• Database integration: +₹4,000
• Admin panel: +₹5,000
• Payment gateway: +₹6,000

Note: Domain and hosting are outsourced services, not provided directly by us.
{{#if isIndian}}All prices include GST.{{else}}VAT/taxes may apply based on your location.{{/if}}

Would you like a customized quote based on your specific needs?`),

    mobile: Handlebars.compile(`Our mobile app development pricing:

• Basic App: ₹50,000
  - Single platform (Android or iOS)
  - Up to 5 screens
  - Basic functionality
  - Standard UI components

• Standard App: ₹80,000
  - Cross-platform development
  - Up to 10 screens
  - User authentication
  - Basic database integration

• Advanced App: ₹120,000+
  - Full native development
  - Custom UI/UX design
  - Complex functionality
  - API integrations

Additional features:
• Push notifications: +₹5,000
• In-app purchases: +₹8,000
• Offline functionality: +₹7,000
• Admin dashboard: +₹10,000

{{#if isIndian}}All prices include GST.{{else}}VAT/taxes may apply based on your location.{{/if}}

Would you like to discuss the specific requirements for your app?`)
  },
  
  // Tech stack template
  techStack: Handlebars.compile(`Our technology stack includes:

• Frontend: React and Next.js for fast, responsive interfaces
• Backend: Express with Bun/Node.js runtime
• Databases: MongoDB (NoSQL) and PostgreSQL (SQL)
• Mobile: React Native for cross-platform applications

This modern stack ensures your solution is:
- Scalable to grow with your business
- Secure against common vulnerabilities
- Fast-loading for better user experience
- Maintainable for future updates

Is there a specific technology you're interested in learning more about?`),
  
  // Follow-up templates
  followUp: {
    day1: Handlebars.compile(`Hello {{name}},

I hope this message finds you well. I wanted to follow up on our conversation about your {{#if industry}}{{industry}} {{/if}}website/software needs.

Did you have any questions I could answer for you?

Looking forward to helping you create the perfect digital solution for {{#if business}}{{business}}{{else}}your business{{/if}}.`),
    
    day6: Handlebars.compile(`Hello {{name}},

I noticed we haven't been able to connect recently. I'm reaching out one final time to see if you're still interested in discussing your {{#if industry}}{{industry}} {{/if}}digital needs.

If you'd like to proceed or have any questions, please let me know. Otherwise, I'll respect your time and won't follow up further.`)
  },
  
  // Email request confirmation
  emailRequest: Handlebars.compile(`I'd be happy to send you detailed information via email.

{{#if hasEmail}}I'll send all the details to {{email}} right away.{{else}}Could you please share your email address so I can send you the complete information?{{/if}}

The email will include our packages, pricing structure, and implementation timeline. Is there any specific information you'd like me to include?`),
  
  // Human escalation templates
  humanEscalation: {
    technical: Handlebars.compile(`That's an excellent technical question about {{keyword}}. 

Please wait while I consult with our development team to provide you with the most accurate information. I'll get back to you shortly with a detailed answer.`),
    
    callRequest: Handlebars.compile(`I'd be happy to arrange a call with our solution specialist. 

We have availability tomorrow at 11:00 AM or 3:00 PM IST. Would either of those times work for you? Or would you prefer a slot on another day?`)
  },
  
  // Objection handling templates
  objectionHandling: {
    price: Handlebars.compile(`I understand your concern about the investment. Many of our clients initially felt the same way.

However, they found that:
1. The ROI from a professional website quickly justifies the cost
2. Our solutions require minimal maintenance costs
3. We offer flexible payment options to fit your budget

We also have a more basic package at ₹12,000 that might better suit your initial needs while allowing for future growth.

What's your primary goal with this website that I might help align with your budget?`),
    
    time: Handlebars.compile(`I understand your timeline concerns. We prioritize efficiency without compromising quality.

For a {{type}} website like you're describing, we typically deliver in {{deliveryTime}} weeks. We could potentially expedite certain aspects if you have a specific launch date in mind.

Would it help to discuss a phased approach where we launch essential features first, then add additional functionality in subsequent updates?`)
  },
  
  // Closing templates
  closing: Handlebars.compile(`Based on our discussion, I believe we can create the perfect solution for {{#if business}}{{business}}{{else}}your business{{/if}}.

To move forward, we would:
1. Finalize your requirements and prepare a detailed proposal
2. Set up a kickoff meeting with our development team
3. Begin the development process with regular updates
4. Deliver and launch your solution

Would you like me to prepare a formal proposal with the features we've discussed?`),
  
  // Domain/hosting disclaimer
  disclaimer: Handlebars.compile(`Please note: Domain and hosting services are outsourced and not provided directly by our company. We'll guide you through the setup process with our trusted partners.`)
};

// ==============================
// Email Templates
// ==============================

export const emailSubjects = {
  proposal: 'Your Custom {{type}} Proposal for {{business}}',
  followUp: 'Following Up: Your {{type}} Project with Shotlin',
  welcome: 'Welcome to Shotlin - Your {{type}} Project',
  information: 'Information About Shotlin {{type}} Services',
};

export const emailTemplates = {
  // Basic information email
  information: Handlebars.compile(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a90e2; color: white; padding: 10px 20px; text-align: center; }
    .footer { background-color: #f5f5f5; padding: 10px 20px; text-align: center; font-size: 12px; }
    .content { padding: 20px 0; }
    .cta-button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 5px; margin: 20px 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Shotlin Web & Software Development</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>Thank you for your interest in Shotlin's services. As requested, here is detailed information about our {{type}} development services.</p>
      
      <h3>Our Packages:</h3>
      <table>
        <tr>
          <th>Package</th>
          <th>Features</th>
          <th>Price</th>
        </tr>
        {{#each packages}}
        <tr>
          <td>{{this.name}}</td>
          <td>{{this.features}}</td>
          <td>{{this.price}}</td>
        </tr>
        {{/each}}
      </table>
      
      <h3>Additional Features:</h3>
      <ul>
        {{#each additionalFeatures}}
        <li><strong>{{this.name}}:</strong> {{this.price}} - {{this.description}}</li>
        {{/each}}
      </ul>
      
      <h3>Our Technology Stack:</h3>
      <p>We use modern technologies including React/Next.js for frontend, Express with MongoDB/PostgreSQL for backend, and React Native for mobile applications.</p>
      
      <h3>Timeline:</h3>
      <p>A typical {{type}} project takes {{timeline}} to complete, depending on complexity and requirements.</p>
      
      <p>Please note: Domain and hosting services are outsourced and not provided directly by our company.</p>
      
      <a href="https://calendly.com/shotlin/30min" class="cta-button">Schedule a Consultation</a>
      
      <p>If you have any questions or would like to discuss your project further, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      Shotlin Team<br>
      www.shotlin.com</p>
    </div>
    <div class="footer">
      <p>© {{year}} Shotlin. All rights reserved.</p>
      <p>This email was sent in response to your request for information.</p>
    </div>
  </div>
</body>
</html>`),

  // Proposal email
  proposal: Handlebars.compile(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a90e2; color: white; padding: 10px 20px; text-align: center; }
    .footer { background-color: #f5f5f5; padding: 10px 20px; text-align: center; font-size: 12px; }
    .content { padding: 20px 0; }
    .cta-button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .proposal-details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a90e2; margin: 20px 0; }
    .price-highlight { font-size: 24px; color: #4a90e2; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Custom {{type}} Proposal</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>Thank you for the opportunity to provide this custom proposal for {{business}}. Based on our discussion, we've prepared the following tailored solution:</p>
      
      <div class="proposal-details">
        <h3>Project Scope:</h3>
        <p>{{description}}</p>
        
        <h3>Included Features:</h3>
        <ul>
          {{#each features}}
          <li><strong>{{this.name}}:</strong> {{this.description}}</li>
          {{/each}}
        </ul>
        
        <h3>Investment:</h3>
        <p class="price-highlight">₹{{price}}{{#if isIndian}} (including GST){{/if}}</p>
        <p>Timeline: {{timeline}}</p>
      </div>
      
      <h3>Next Steps:</h3>
      <ol>
        <li>Review this proposal and let us know if you have any questions</li>
        <li>Confirm your acceptance to proceed</li>
        <li>Make the initial payment of 40% to begin the project</li>
        <li>Schedule a kickoff meeting with our development team</li>
      </ol>
      
      <p>This proposal is valid for 15 days from {{formatDate currentDate}}.</p>
      
      <p>Please note: Domain and hosting services are outsourced and not provided directly by our company.</p>
      
      <a href="https://shotlin.com/payment/{{proposalId}}" class="cta-button">Accept Proposal & Make Payment</a>
      
      <p>If you have any questions or would like to discuss modifications to this proposal, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      Shotlin Team<br>
      www.shotlin.com</p>
    </div>
    <div class="footer">
      <p>© {{year}} Shotlin. All rights reserved.</p>
      <p>This proposal is subject to our standard terms and conditions.</p>
    </div>
  </div>
</body>
</html>`)
};

// Helper function to get industry-specific template
export const getIndustryTemplate = (industry) => {
  if (!industry) return messageTemplates.industry.default;
  
  const normalizedIndustry = industry.toLowerCase().trim();
  
  if (messageTemplates.industry[normalizedIndustry]) {
    return messageTemplates.industry[normalizedIndustry];
  }
  
  return messageTemplates.industry.default;
};

// Helper function to format appropriate prices for region
export const formatPricesForRegion = (content, isIndian = true) => {
  return content.replace(/₹([0-9,]+)/g, (match, price) => {
    if (isIndian) {
      return `₹${price} (incl. GST)`;
    } else {
      return `$${Math.round(parseInt(price.replace(/,/g, '')) / 75)} (plus VAT)`;
    }
  });
};

// Helper to detect if a number is Indian (+91)
export const isIndianNumber = (phone) => {
  return phone.startsWith('+91') || phone.startsWith('91');
};

// Get current year for copyright
export const getCurrentYear = () => {
  return new Date().getFullYear();
};