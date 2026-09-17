import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { wrapAsync } from "../utlis/wrapAsync.js";

export const checkTaskProjectMember  = wrapAsync(async (req, res, next) => {

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

    if (!member) {
        throw new ExpressErr(403, 'Not authorized for this project');
    }
    if (member.role !== 'project_manager' && 
        (!task.assignee ||task.assignee.toString() !== req.user._id.toString())){
         throw new ExpressErr(403,'You can only update tasks assigned to you');
   }
    req.task = task;
    req.project = project;
    req.member = member;

    next();
});