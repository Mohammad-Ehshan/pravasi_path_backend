import { catchAsyncError } from "../middlerwares/catchAsyncError.js";
import ErrorHandler from "../middlerwares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("Please fill full registration form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already exist!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });
  sendToken(user, 200, res, "User registered successfully!");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(
      new ErrorHandler("Please provide email,password and role!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("This role does not exist!", 400));
  }
  sendToken(user, 200, res, "User logged in successfully!");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "User successfully logged out!",
    });
});

export const getUser = catchAsyncError((req,res,next)=>{
const user = req.user;
res.status(200).json({
  success:true,
  user,
});
});
