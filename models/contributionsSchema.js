const mongoose = require('mongoose');

// Define the Contributions schema
const contributionSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  }
});


const Contribution = mongoose.models.Contribution || mongoose.model('Contribution', contributionSchema);

module.exports =  Contribution;