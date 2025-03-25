import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  name:{
    type: String,
    required:[true,"Please provide your name!"],
    minLength:[3,"Name must contain atlest 3 character!"],
    maxLength:[30,"Name cannot exceed 30 character!"]
  },
  email:{
    type: String,
    required:[true,"Please provide a email!"],
    validator:[validator.isEmail,"Please enter a valid email!"]
  },
  coverLetter:{
    type: String,
    required:[true,"Please provide your cover letter!"]
  },
  resume:{
   public_id:{
    type:String,
    required:true
   },
   url:{
    type:String,
    required:true
   },
  },
   applicantID:{
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    role:{
      type:String,
      required:true,
      enum:["Job seeker"]
    }
   },
   employerID:{
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    role:{
      type:String,
      required:true,
      enum:["Employer"]
    }
   }
})

export const Application = mongoose.model("Application",applicationSchema);