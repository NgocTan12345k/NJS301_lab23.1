const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.Signup = async (req, res, next) => {
  const { email, password, userName } = req.body;

  const userList = await User.find();
  const emailList = userList.map((item) => {
    return item.email;
  });
  const userNameList = userList.map((item) => {
    return item.userName;
  });
  try {
    if (userNameList.includes(userName) === true) {
      res.status(200).json({ message: "Name already exists!" });
    } else if (emailList.includes(email) === true) {
      res.status(200).json({ message: "Email already exists!" });
    } else {
      let encryptedPassword = "";
      bcrypt.hash(password, 12, async (err, hash) => {
        encryptedPassword = hash;
        const newUser = new User({
          email: email,
          userName: userName,
          password: encryptedPassword,
        });
        await newUser.save();
        res.status(200).json({ message: "Signup successful!" });
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(200).json({ message: "Wrong email!" });
    } else {
      const temp = {
        userId: user._id,
        userEmail: user.email,
        userPassword: user.password,
      };
      let decodedPassword = temp.userPassword;
      bcrypt.compare(password, decodedPassword, function (err, result) {
        if (result === true) {
          res.status(200).json({ message: "Login successful!", user: temp });
        } else {
          res.status(200).json({ message: "Wrong password!" });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
