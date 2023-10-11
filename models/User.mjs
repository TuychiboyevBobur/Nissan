import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
    minLength: [13, "Please enter a valid phone number"],
  },
  agree: {
    type: String,
    required: [true, "Please agree to the terms and conditions"],
    
  },
  email: {
    type: String,
    required: [true, "Please enter email address"],
    unique: true,
    validator: [isEmail, `To'g'ri email kirit`],
  },
  password: {
    type: String,
    required: [true, "Please enter a valid password"],
    minLength: [6, "Minumum password length is 6 characters"],
  },
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
userSchema.post("save", (doc, next) => {
  console.log("new user was created & saved", doc);
  next();
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("users", userSchema);

export default User;
