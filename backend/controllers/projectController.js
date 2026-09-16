import Project from "../models/projectModel.js";
import  {sendInviteEmails}  from "../services/emailService.js";
import ExpressErr from "../utlis/ExpressErr.js";

export const createProject = async (req,res)=>{
    const {projectName, projectType, description,inviteEmails,projectTypeOther } = req.body;
     
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
      let emailResult = { sent: 0, failed: [] };
      if (inviteEmails && inviteEmails.length > 0) {
        console.log("➡️ CALLING sendInviteEmails NOW");
      try {
        emailResult = await sendInviteEmails({
          emails: inviteEmails,
          inviteCode: project.inviteCode,
          projectName: project.projectName,
          inviterName: req.user.name,
        });
        console.log("🚀 ABOUT TO SEND INVITES");
console.log("INVITE EMAILS:", inviteEmails);
      } catch (emailErr) {
        console.error('Invite email sending failed:', emailErr.message);
      }
    }
      res.status(201).json({ success: true, project,emailResult });
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
         roleOther :  role === 'other'? roleOther.trim() : undefined,
         joinedAt : Date.now()

     });
     await project.save();
     res.status(200).json({ success: true, project, message: "Joined project successfully" });
}

export const getMyProjects = async (req,res)=>{
    const projects = await Project.find({'members.user' : req.user._id})
      .populate('members.user', 'name email');
      res.json({ success: true, projects });
}

export const getProjectById = async(req,res)=>{
    const {projectId} = req.params;
    const project = await Project.findById(projectId).populate('members.user','name email');
    if (!project) throw new ExpressErr(404, 'Project not found');

    const isMember =  project.members.some(mem=> mem.user._id.toString() === req.user._id.toString());
    if(!isMember) throw new ExpressErr(403, 'Not authorized to view this project');
     res.status(200).json({ success: true, project });

}

export const transferOwnership = async (req, res) => {
  const { projectId } = req.params;
  const { newOwnerId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ExpressErr(404, 'Project not found');

  const isCurrentOwner = project.createdBy.toString() === req.user._id.toString();
  if (!isCurrentOwner) throw new ExpressErr(403, 'Only the current owner can transfer ownership');

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