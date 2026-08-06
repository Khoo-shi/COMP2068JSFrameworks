const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [100, 'Resource name cannot exceed 100 characters']
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Education',
        'Employment',
        'Food Support',
        'Health',
        'Housing',
        'Settlement',
        'Other'
      ]
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    isFree: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resource', resourceSchema);