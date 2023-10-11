import User from "../models/User.mjs";
import jwt from "jsonwebtoken";

const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {
    firstName: "",
    lastName: "",
    agree: "",
    email: "",
    password: "",
    phoneNumber: "",
  };

  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  if (err.code == 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

export const signup_get = (req, res) => {
  res.render("signup");
};
export const login_get = (req, res) => {
  res.render("login");
};
export const acc_get = (req, res) => {
  res.render("acc");
};
export const accept_get = (req, res) => {
  res.render("accept");
};

const maxAge = 3 * 24 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "ninja secret", { expiresIn: maxAge });
};

export const signup_post = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password, agree } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      agree,
      email,
      password,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
export const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

export const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
