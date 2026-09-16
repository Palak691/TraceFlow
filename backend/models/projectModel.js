import mongoose from "mongoose";
import crypto from 'crypto'

const projectSchema = new mongoose.Schema({
    projectName : {
        type : String,
        required :  true,
    },
    projectType : {
         type : String,
         enum : ['residential', 'commercial', 'institutional', 'interior', 'renovation', 'other'],
         required :  true
    },
    projectTypeOther :{
        type : String,
        trim : true,
        required : function(){return this.projectType === 'other'}
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    description : {
        type : String,
        required : true
    },
    inviteCode : {
      type : String,
      unique : true,
      required : true
    },
    members : [{
       user : { type : mongoose.Schema.Types.ObjectId, ref : 'User'},
       role : {
         type : String,
         enum : ['project_manager', 'client', 'architect', 'contractor', 'vendor','other'],
         required: true
       },
       roleOther : {
        type : String,
        trim : true,
        required : function (){return this.role === 'other'}
        },
       joinedAt : {
        type : Date,
        default : Date.now
       }
}]     
},{timestamps : true})



projectSchema.pre('validate', async function() {
  if (!this.inviteCode) {
    let code;
    let exists = true;
    while (exists) {
      code = crypto.randomBytes(4).toString('hex');
      exists = await mongoose.models.Project.exists({ inviteCode: code });
    }
    this.inviteCode = code;
  }
 
});

projectSchema.post('findOneAndDelete',async function(deletedProject){
  if(!deletedProject) return;
  const projectId = deletedProject._id;
  await Promise.all([

    mongoose.model('Conversation').deleteMany({ projectId }),
    mongoose.model('Task').deleteMany({ projectId }),
    mongoose.model('Decision').deleteMany({ projectId }),
    
  ]);


});


const Project = mongoose.model("Project" , projectSchema);
export default Project;
