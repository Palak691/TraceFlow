import Project from '../models/projectModel.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import  ExpressErr  from '../utlis/ExpressErr.js'; 



export const checkProjectManager = wrapAsync(async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId || req.query.projectId;

  const project = await Project.findById(projectId);
  if (!project) throw new ExpressErr(404, 'Project not found');

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member || member.role !== 'project_manager') {
    throw new ExpressErr(403, 'Only the project manager can perform this action');
  }

  req.project = project;
  req.member = member;
  next();
});