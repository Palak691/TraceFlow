import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
  projectId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Project',
    required : true
  },
  conversationId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Conversation',
    required : true

  },
  assignee : {
     type : mongoose.Schema.Types.ObjectId,
     ref : 'User'
  },
  assigneeRaw : {
    type : String
  },
  title :{
      type: String,
      required: [true, "Task title is required"],
      trim: true,
  },
  deadline :{
    type : Date,
    default : null
  },
  status : {
    type : String,
    enum : ['pending','in_progress','completed'],
    default : 'pending'
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  flaggedBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   default: null
 }
},{timestamps : true});


taskSchema.index({ title: 'text' });

const Task = mongoose.model("Task" , taskSchema);
export default Task;
