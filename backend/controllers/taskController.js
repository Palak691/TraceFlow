import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import ExpressErr from '../utlis/ExpressErr.js'

export const getTasksByProject = async (req,res)=>{
 const {projectId} = req.params
 const tasks = await Task.find({projectId : projectId}).populate('assignee','name email')
 .sort({deadline : 1 , createdAt : -1});
  res.json({ success: true, tasks });
}

export const updatetask = async (req,res)=>{
 const {taskId} = req.params
 const allowedUpdates = ['status', 'assignee', 'deadline', 'title'];
  const task = await Task.findById(taskId);
  if (!task) throw new ExpressErr(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  const isMember = project.members.some(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) throw new ExpressErr(403, 'Not authorized to update this task');
 const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });
  if (!task) throw new ExpressErr(404, 'Task not found');
  res.json({ success: true, updatedTask });
}

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) throw new ExpressErr(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  const isMember = project.members.some(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) throw new ExpressErr(403, 'Not authorized to delete this task');
  await Task.findByIdAndDelete(taskId);
  
  res.json({ success: true, message: 'Task deleted' });
};


//reviews


export const flagTaskForReview = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) throw new ExpressErr(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  const isMember = project.members.some(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) throw new ExpressErr(403, 'Not authorized to flag this task');

  task.flaggedForReview = true;
  task.flaggedBy = req.user._id;
  await task.save();

  res.json({ success: true, task });
};

export const resolveFlag = async (req, res) => {
  const { taskId } = req.params;
  const { newAssignee } = req.body; // optional — PM can reassign while resolving

  const task = await Task.findById(taskId);
  if (!task) throw new ExpressErr(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!member || member.role !== 'project_manager') {
    throw new ExpressErr(403, 'Only the project manager can resolve a flagged task');
  }

  if (newAssignee) {
    const isValidAssignee = project.members.some(
      m => m.user.toString() === newAssignee.toString()
    );
    if (!isValidAssignee) throw new ExpressErr(400, 'newAssignee must be a project member');
    task.assignee = newAssignee;
  }

  task.flaggedForReview = false;
  task.flaggedBy = null;
  await task.save();

  res.json({ success: true, task });
};