const Plan = require("../models/Plan");

const createPlan = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    const newplan = new Plan({
      name,
      price,
      description,
    });
    await newplan.save();
    return res.status(200).json({
      success: true,
      message: "Plan created successfully",
      data: newplan,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getPlan  = async(req, res) => {
    try{
        const plan = await Plan.find();
        return res.status(200).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });

    }
    catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
    
}

module.exports = { createPlan , getPlan };
