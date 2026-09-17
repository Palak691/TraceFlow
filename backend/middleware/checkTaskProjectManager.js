import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { wrapAsync } from "../utlis/wrapAsync.js";

export const checkTaskProjectManager = wrapAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    throw new ExpressErr(404, 'Task not found');
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    throw new ExpressErr(404, 'Project not found');
  }

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member || member.role !== 'project_manager') {
    throw new ExpressErr(
      403,
      'Only the project manager can resolve a flagged task'
    );
  }

  req.task = task;
  req.project = project;
  req.member = member;

  next();
});