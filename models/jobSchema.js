import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type:String,
    required: [true,"Please provide a title for this job!"],
    minLength: [3,"Title must contain 3 letters!"],
    maxLength: [50,"Title should not exceed 50 letters!"]
  },
  description: {
    type:String,
    required: [true,"Please provide a description for this job!"],
    minLength: [10,"Description must contain 10 letters!"],
    maxLength: [350,"Description should not exceed 350 letters!"]
  },
  category: {
    type:String,
    required: [true,"Please provide category of this job!"],
  },
  country: {
    type:String,
    required: [true,"Country of this job is required!"],
  },
  city: {
    type:String,
    required: [true,"Job city is required!"],
  },
  location: {
    type:String,
    required: [true,"Job location is required!"],
    minLength:[10,"Job location must contain 10 letters"]
  },
   fixedSalary: {
    type:Number,
    minLength: [4,"Salary should be more than 1000rs!"],
    maxLength: [8,"Salary should not exceed 10000000rs!"]
   },
   salaryFrom: {
    type:Number,
    minLength: [4,"Salary should be more than 1000rs!"],
    maxLength: [8,"Salary should not exceed 10000000rs!"]
   },
   salaryTo: {
    type:Number,
    minLength: [4,"Salary should be more than 1000rs!"],
    maxLength: [8,"Salary should not exceed 10000000rs!"]
   },
  expired: {
    type:Boolean,
    default:false
  },
  jobPostedOn: {
    type:Date,
    default:Date.now
  },
  postedBy:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:"true"
  }
})

export const Job = mongoose.model("Job",jobSchema);