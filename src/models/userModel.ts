import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const validateEmail = function (email: string) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export interface UserInterface extends Document {
  name: string;
  lastName: string;
  email: string;
  number: string;
  verified: boolean;
  isAdmin: boolean;
  code: string;
  gender: string;
  password: string;
  matchPassword: (enteredPassword: string) => boolean;
}

const userSchema: Schema<UserInterface> = 
  new mongoose.Schema<UserInterface>(
  {
    verified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required : false,
      validate: [validateEmail, "enter a valide email !"],
    },
    number: {
      type: String,
      unique: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (this, next: any) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

userSchema.methods.matchPassword = async function (
  this,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<UserInterface>("User", userSchema);
export default User;
