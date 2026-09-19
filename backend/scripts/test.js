import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';
// dotenv.config()
dotenv.config({path : '../.env'});

const MONGO_URL = process.env.MONGO_URL;





async function test(){
  try{
  await mongoose.connect(MONGO_URL);
  console.log("connected to mongoDb");

//  const result = await Project.findOne({ _id: '6aabd34d3c50fd83f9093983' }, { members: 1 })
const result =  await Task.find({ assigneeRaw: 'Vikram' })
  console.log("DONE",result);
}finally{
  await mongoose.disconnect();

}

}

test().catch(console.error);
