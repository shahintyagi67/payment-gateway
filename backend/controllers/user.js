const user = require("../models/user");

const signupUser = async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;
    if (!name || !email || !phone || !country)  {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    const newUser = new user({
      name,
      email,
      phone,
      country
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
 module.exports = {signupUser}
