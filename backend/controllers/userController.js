import ExpressErr from '../utlis/ExpressErr.js'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import Project from '../models/projectModel.js';

export const register = async (req,res)=>{
        const {name,email,password} = req.body;
        if(!name || !email ||!password){
            throw new ExpressErr(400, 'All Fields Are Required');
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existsEmail = await User.findOne({email : normalizedEmail});
        if(existsEmail){
            throw new ExpressErr(400, 'Email Already Exists');
            
        }
        const hashedPassword = await bcrypt.hash(password,8);
        const newUser = await User.create({
            name,
            email,
            password : hashedPassword,
            
        });
      
        res.status(201).json({ success: true, user: { id: newUser._id, name: newUser.name, email: newUser.email }});
}

export const login = async  (req,res)=>{
     const {email, password} = req.body;
    if(!email || !password){
        throw new ExpressErr(400, 'Email and Password Are Required');

    }
    const normalizedEmail = email.trim().toLowerCase();
    const existsUser = await User.findOne({email :normalizedEmail}).select("+password");
    if(!existsUser){
        throw new ExpressErr(400, 'User not found!');
    }
    
    const isMatched = await bcrypt.compare(password, existsUser.password);
    if(!isMatched){
        throw new ExpressErr(400, 'Invalid Credentials!');
    }
    let payload  = {userId : existsUser._id, email : existsUser.email}
    const token = jwt.sign(payload, process.env.KEY, {expiresIn:"7d"});
    return res.status(200).json({message : "Login Successfully!!" , token : token, user : {
         _id: existsUser._id,
        name: existsUser.name,
        email: existsUser.email,
        profilePicture: existsUser.profilePicture
    } });

    
}

export const uploadProfilePicture = async (req,res) =>{
    if (!req.file) throw new ExpressErr(400, 'No file uploaded');
        req.user.profilePicture = req.file.path;
        await req.user.save();
        return res.status(200).json({message : "Profile Picture Saved!",profilePicture: req.user.profilePicture,});
}


export const getUserAndProfile = async (req, res) => {
    const user = req.user;
    const userId = user._id;
//Find all projects where the user is a member
    const projects = await Project.find({'members.user': userId}).select('projectName members');

    const myProjects = projects.map(p => {
        const myMembers = p.members.find(m => m.user.toString() === userId.toString());

        return {
            projectId: p._id,
            projectName: p.projectName,
            role: myMembers.role === 'other'
                ? myMembers.roleOther
                : myMembers.role
        };
    });

    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            memberSince: user.createdAt
        },
        projects: myProjects
    });
};




export const updateUserProfileData = async(req,res)=>{
    const {  name} = req.body;               
  if (name && name.trim()) {
    await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
  }
  const updatedUser = await User.findById(req.user._id);
  return res.status(200).json({ success: true, user: updatedUser });
}