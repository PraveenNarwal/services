import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const secret = "test";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "user already exxists please try with different id" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result.id }, secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (err) {
    res.status(500).json({ message: "something is wrong" });
    console.log(err);
  }
};
