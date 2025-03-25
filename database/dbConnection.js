import mongoose from "mongoose";

export const dbConnection = () =>{
  mongoose.connect(process.env.MONGO_URI,{
    dbName: "MERN_Job_portal"
  }).then(()=>{
    console.log("Connected to Database!")
  }).catch((err)=>{
    console.log(`some error occured while connecting to Database: ${err}`)
  })
}
