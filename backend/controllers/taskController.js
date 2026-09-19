import Task from "../models/taskModel.js";
import ExpressErr from '../utlis/ExpressErr.js'

export const getTasksByProject = async (req,res)=>{

  const tasks = await Task.find({ projectId: req.project._id}).populate('assignee', 'name email')
  .sort({  createdAt: -1 });

  res.json({ success: true, tasks });

}

export const updateTask = async (req,res)=>{

  const { status, assignee, deadline, title } = req.body;
  const isManager = req.member.role === 'project_manager';

  const updates = {
    ...(status !== undefined && {status}),
    ...(isManager && assignee !== undefined && {assignee}),
    ...(isManager && deadline !== undefined && {deadline}),
    ...(isManager && title !== undefined && {title}),
  };
 
  if (!isManager && (assignee !== undefined || deadline !== undefined || title !== undefined)) {
    throw new ExpressErr(403, 'Only the project manager can change assignee, deadline, or title');
  }

  if(updates.assignee){ const isMemberOfProject = req.project.members.some(m =>
         m.user.toString() === updates.assignee);
    if (!isMemberOfProject) throw new ExpressErr(400, 'Assignee must be a project member');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.task._id, updates, { new: true, runValidators: true })
  .populate('assignee', 'name email');

  res.json({ success: true, updatedTask });

}

export const deleteTask = async (req, res) => {

  await Task.findByIdAndDelete(req.task._id);
  res.json({ success: true, message: 'Task deleted'});

};


//reviews
export const flagTaskForReview = async (req, res) => {
 
  req.task.flaggedForReview = true;
  req.task.flaggedBy = req.user._id;

  await req.task.save();

  res.json({success: true,task: req.task});
 };

export const resolveFlag = async (req, res) => {
   if (!req.task.flaggedForReview) {
    throw new ExpressErr(400, 'This task is not currently flagged for review');
  }
  const { newAssignee } = req.body;

  if (newAssignee) {
    const isValidAssignee = req.project.members.some( m => m.user.toString() === newAssignee.toString());
    if (!isValidAssignee) {
      throw new ExpressErr( 400,'newAssignee must be a project member');}
       req.task.assignee = newAssignee;
    }

  req.task.flaggedForReview = false;
  req.task.flaggedBy = null;

  await req.task.save();

  res.json({success: true,task: req.task});

};