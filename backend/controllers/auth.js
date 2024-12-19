const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
}

const loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid login credentials');
      }
      
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid login credentials');
      }
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.send({ user, token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
}

const getUser = async (req, res) => {
    res.send(req.user);
}

module.exports = { registerUser, loginUser, getUser };
