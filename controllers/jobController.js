import { catchAsyncError } from "../middlerwares/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middlerwares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const role = req.user.role;
  if (role === "Job seeker") {
    return next(
      new ErrorHandler("Job Seeker are not allowed to post jobs!", 400)
    );
  }
  const{
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo
  } = req.body

  if(!title || !description || !category || !country || !city || !location){
   return next(new ErrorHandler("Please provide full Job details!",400)) ;
  }
 if(!fixedSalary && (!salaryFrom || !salaryTo)){
  return next(new ErrorHandler("Please provide fixed salary or ranged salary for this job!"));
 }
if (fixedSalary && salaryFrom && salaryTo){
  return next(new ErrorHandler("Cannot enter both fixed salary and ranged salary!")); 
}

const postedBy = req.user._id;
const job = await Job.create({
  title,
  description,
  category,
  country,
  city,
  location,
  fixedSalary,
  salaryFrom,
  salaryTo,
  postedBy
})

 res.status(200).json({
  success: true,
  message:"Job posted succesfully!",
  job
 }) 
});

export const getmyJobs = catchAsyncError(async(req,res,next)=>{
  const role = req.user.role;
  if (role === "Job seeker") {
    return next(
      new ErrorHandler("Job Seeker are not allowed to post jobs!", 400)
    );
  }
  const myjobs = await Job.find({postedBy : req.user._id});
  res.status(200).json({
    success:true,
    myjobs,
  });
})

export const updateJob = catchAsyncError(async(req,res,next)=>{
  const role = req.user.role;
  if(role ===  "Job seeker") {
    return next(
      new ErrorHandler("Job Seeker are not allowed to post jobs!",400)
    );
  }
  const {id} = req.params;
  let job = await Job.findById(id);
  if(!job){
    return next(
      new ErrorHandler("Oops, job not found!"),
      404
    )
  }
  job = await Job.findByIdAndUpdate(id,req.body,{
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success:true,
    message:"Job Updated Successfully!",
    job,
  });
})

export const deleteJob = catchAsyncError(async(req,res,next)=>{
  const role = req.user.role;
  if(role ===  "Job seeker") {
    return next(
      new ErrorHandler("Job Seeker are not allowed to post jobs!",400)
    );
  }
  const {id} = req.params;
  let job = await Job.findById(id);
  if(!job){
    return next(
      new ErrorHandler("Oops job not found!"),
      404
    )
  }
 job = await Job.deleteOne()
  res.status(200).json({
    success:true,
    message:"Job Deleted Successfully!"
  })
})

export const getSinglejob = catchAsyncError(async(req,res,next)=>{
 const {id} = req.params;
 try {
  const job = await Job.findById(id);
  if(!job){
    return next(
      new ErrorHandler("Job not found!"),
    );
  }
  res.status(200).json({
    success:true,
    job,
  })
 } catch (error) {
  return next(
    new ErrorHandler("Invalid Id / Cast Error !",400)
  )
 }
})