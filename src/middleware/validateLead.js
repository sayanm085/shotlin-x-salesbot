// Lead validation middleware
import Joi from 'joi';

const leadSchema = Joi.object({
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  email: Joi.string().email().allow(null, '').trim(),
  shopName: Joi.string().allow(null, '').trim(),
  industry: Joi.string().allow(null, '').trim(),
  status: Joi.string().valid('new', 'contacted', 'interested', 'proposal_sent', 'closed_won', 'closed_lost'),
  notes: Joi.string().allow(null, '').trim(),
  aiEnabled: Joi.boolean(),
  source: Joi.string().valid('manual', 'csv_import', 'whatsapp')
});

const validateLead = (req, res, next) => {
  const { error } = leadSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};

export default validateLead;