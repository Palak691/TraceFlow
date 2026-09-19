import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import ExpressErr from "../utlis/ExpressErr.js";
import { wrapAsync } from "../utlis/wrapAsync.js";

const loadTaskContext = async (req) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) throw new ExpressErr(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  if (!project) throw new ExpressErr(404, 'Project not found');

  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member) throw new ExpressErr(403, 'Not authorized for this project');

  return { task, project, member };
};

export const checkTaskProjectManager = wrapAsync(async (req, res, next) => {
  const { task, project, member } = await loadTaskContext(req);
  if (member.role !== 'project_manager') {
    throw new ExpressErr(403, 'Only the project manager can perform this action');
  }
  req.task = task; req.project = project; req.member = member;
  next();
});

export const checkTaskProjectMember = wrapAsync(async (req, res, next) => {
  const { task, project, member } = await loadTaskContext(req);
  if (member.role !== 'project_manager' &&
      (!task.assignee || task.assignee.toString() !== req.user._id.toString())) {
    throw new ExpressErr(403, 'You can only update tasks assigned to you');
  }
  req.task = task; req.project = project; req.member = member;
  next();
});