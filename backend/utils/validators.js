const { z } = require('zod');

// Schema for User Registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DRIVER', 'GARAGE_OWNER', 'ADMIN'], {
    errorMap: () => ({ message: "Role must be DRIVER, GARAGE_OWNER, or ADMIN" })
  })
});

// Helper to safely parse JSON strings for multipart/form-data
const safelyParseJSON = (val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }
  return val;
};

// Schema for Garage Creation
const createGarageSchema = z.object({
  name: z.string().min(3, 'Garage name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  location: z.preprocess(safelyParseJSON, z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.array(z.number()).length(2, 'Location must have exactly 2 coordinates [lng, lat]')
  })),
  services: z.preprocess(safelyParseJSON, z.array(z.object({
    service_type: z.string().min(1, 'Service type is required'),
    price_estimate: z.number().min(0, 'Price must be positive')
  })).optional().default([]))
});

module.exports = {
  registerSchema,
  createGarageSchema
};
