import { catchAsyncError } from "../middlerwares/catchAsyncError.js";
import ErrorHandler from "../middlerwares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import {Job} from "../models/jobSchema.js"

export const employerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job seeker") {
      return next(
        new ErrorHandler(
          "Job Seekers are not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer are not allowed to access this resource!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employer are not allowed to access this resource!",
          400
        )
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Oops,applicatin not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application deleted successfully!",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer is not allowed to access this resource!", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume file Required!",404));
  }
  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file formate. Please provide file in png,jpg or webp format",
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknow cloudinary Error!"
    );
    return next(new ErrorHandler("Failed to upload resume!", 500));
  }
  const { name, email, coverLetter, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please provide all the field!",400));
  }
  
  const application = await Application.create({
    name,
    email,
    coverLetter,
    applicantID,
    employerID,
    resume:{
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
   res.status(200).json({
    success:true,
    message:"Application submitted successfully!",
    application
   })
});
