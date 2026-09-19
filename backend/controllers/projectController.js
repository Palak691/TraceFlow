import { namesMatch } from "../aiServices/extractionParser.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import ExpressErr from "../utlis/ExpressErr.js";

export const createProject = async (req,res)=>{
    const {projectName, projectType, description,projectTypeOther } = req.body;
     
    if (!projectName) throw new ExpressErr(400, 'Project name is required');
    if (!projectType) throw new ExpressErr(400, 'Project type is required');

    const allowedProjectTypes = ['residential', 'commercial', 'institutional', 'interior', 'renovation', 'other'];
    if (!allowedProjectTypes.includes(projectType)) {
     throw new ExpressErr(400, 'Please select a valid project type');
     }
    if (projectType === 'other' && (!projectTypeOther || !projectTypeOther.trim())) {
        throw new ExpressErr(400, 'Invalid project type');
     }

     const project = await Project.create({
        projectName,
        projectType,
        projectTypeOther,
        description,
        createdBy : req.user._id,
        members : [{user : req.user._id , role :  'project_manager'}]
     });
   
      res.status(201).json({ success: true, project });
}

export const joinProject = async(req,res)=>{
    const {inviteCode, role, roleOther} = req.body;//ui
    const allowedJoinRoles = ['client', 'architect', 'contractor', 'vendor','other'];

    if (!allowedJoinRoles.includes(role)) {
    throw new ExpressErr(400, 'Please select a valid role to join this project');
     }
     if(role === 'other' && (!roleOther || !roleOther.trim())){
        throw new ExpressErr(400, 'Invalid role');
     }
    const project = await Project.findOne({ inviteCode });
    if (!project) throw new ExpressErr(404, 'Invalid invite code');

    const alreadyMember = project.members.some(member=>
     member.user.toString() === req.user._id.toString());
    if (alreadyMember) throw new ExpressErr(409, 'Already a member of this project');

     project.members.push({
         user : req.user._id,
         role ,
         roleOther :  role === 'other'? roleOther.trim() : null,
         joinedAt : Date.now()

     });
     await project.save();

     // reconcile: assign any previously-unmatched tasks whose raw name matches this new member
     const unresolvedTasks = await Task.find({
       projectId: project._id,
       assignee: null,
       assigneeRaw: { $ne: null }
     });
  
     const toReassign = unresolvedTasks.filter(t => namesMatch(t.assigneeRaw, req.user.name));

     if (toReassign.length) {
       await Task.updateMany(
         { _id: { $in: toReassign.map(t => t._id) } },
         { $set: { assignee: req.user._id, assigneeRaw: null } }
       );
     }
       const updatedTasks = await Task.find({
    projectId: project._id,
    assignee: req.user._id
  });


     res.status(200).json({ success: true, project, message: "Joined project successfully" });
}

export const getMyProjects = async (req,res)=>{
    const projects = await Project.find({'members.user' : req.user._id})
      .populate('members.user', 'name email');
      res.json({ success: true, projects });
}

export const getProjectById = async(req,res)=>{

    const project = await Project.findById(req.project._id)
        .populate('members.user', 'name email');

    res.status(200).json({ success: true, project});
  
}

export const transferOwnership = async (req, res) => {

  const { newOwnerId } = req.body;
  const project = req.project;

  const targetMember = project.members.find(m => m.user.toString() === newOwnerId);
  if (!targetMember) throw new ExpressErr(400, 'New owner must already be a project member');

  // demote current owner to their next-most-senior role, promote target
  const currentOwnerMember = project.members.find(m => m.user.toString() === req.user._id.toString());
  currentOwnerMember.role = 'other';
  currentOwnerMember.roleOther = 'Former Owner';

  targetMember.role = 'project_manager';
  project.createdBy = newOwnerId;

  await project.save();
   res.json({ success: true, project });
};

export const deleteProject = async (req, res) => {
 
  await Project.findByIdAndDelete(req.project._id);

  res.status(200).json({ success: true, message: 'Project deleted successfully'});
};
