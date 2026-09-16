import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
  projectId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Project',
    required : true

  },
  sourceType : {//ocr?/
    type : String,
    enum : ['chat','email','manual','meeting','call','transcript','voice_note','image'],
    default : 'chat'

  },
  rawText :{
   type : String,
   required : [true, 'Text is required']
  },
  summary : {
   type : String,

  },
  processedAt :{
    type : Date
  },
  uploadedBy:{
     type : mongoose.Schema.Types.ObjectId,
     ref : 'User'
  }
},{timestamps : true});

conversationSchema.index({ rawText: 'text', summary: 'text' });


const Conversation = mongoose.model("Conversation" , conversationSchema);
export default Conversation;
