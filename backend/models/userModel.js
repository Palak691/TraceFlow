import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :  true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
  
    password : {
       type : String,
       required:  true,
       select : false
    },
    
    profilePicture : {
        type : String,
        default : null
    },
    
     
},{timestamps : true});


userSchema.post('findOneAndDelete', async function(deletedUser){
   if (!deletedUser) return;

  const userId = deletedUser._id;
  const Project = mongoose.model('Project');

  const ownedProjects = await Project.find({createdBy : userId});
  const ownedProjectIds = ownedProjects.map(p=>p._id);

  if(ownedProjectIds.length){
    await Promise.all([
        mongoose.model('Conversation').deleteMany({projectId : {$in : ownedProjectIds}}),
        mongoose.model('Task').deleteMany({projectId : {$in : ownedProjectIds}}),
        mongoose.model('Decision').deleteMany({projectId : {$in : ownedProjectIds}}),
        Project.deleteMany({_id : {$in : ownedProjectIds }})
    ])
    };

    await Project.updateMany({'members.user' : userId},{$pull : {members : {user : userId}}} );

    await mongoose.model('Conversation').updateMany({uploadedBy : userId},{$set : {uploadedBy : null}});
    
    await mongoose.model('Task').updateMany({assignee : userId},{$set : {assignee : null}})

  
});




const User = mongoose.model("User" , userSchema);
export default User;
