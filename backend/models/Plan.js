const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true},
  price:{
    type: String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  createAt:{
    type:Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', planSchema);
