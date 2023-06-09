const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zxcbn = require('zxcvbn');
const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

class UserService {
  async signup(userPassword, userEmail) {
    try {

      if(!emailRegex.test(userEmail)){
        throw new Error('Email invalide');
      }
      
      const passwordStrength = zxcbn(userPassword);
      
      if(passwordStrength.score < 2){
        throw new Error('Mot de passe trop faible');
      }
      
      const hash = await bcrypt.hash(userPassword, 10);
      
      const user = new User({
        email: userEmail,
        password: hash,
      });
      
      return await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }


  async login(userPassword, userEmail) {
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error("Paire identifiant/mot de passe incorrecte");
      }
      const isValidPassword = await bcrypt.compare(userPassword, user.password);
      if (!isValidPassword) {
        throw new Error("Paire identifiant/mot de passe incorrecte");
      }
      return {
        userId: user._id,
        token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
          expiresIn: "24h",
        }),
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new UserService();
