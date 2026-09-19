import Conversation from "../models/conversationModel.js";
import { processAndSaveConversation } from "../aiServices/conversationService.js";
import { extractTextFromImage } from "../services/ocrService.js";
import ExpressErr from "../utlis/ExpressErr.js";
import Task from "../models/taskModel.js";
import Decision from "../models/decisionModel.js";



export const createConversation = async (req, res) => {
  const {source, rawText } = req.body;
  if (!rawText) throw new ExpressErr(400, ' rawText is required');

  const result = await processAndSaveConversation({
    projectId : req.project._id,
    source: source || 'chat',
    rawText,
    userId: req.user._id
  });

  res.status(201).json({ success: true, ...result });
};

export const createConversationFromImage = async (req, res) => {
  if (!req.file) throw new ExpressErr(400, 'No image uploaded');

  let extractedText;
  try {
    extractedText = await extractTextFromImage(req.file.path);
  } catch (err) {
    throw new ExpressErr(400, 'Could not read text from image. Try a clearer screenshot.');
  }

  const result = await processAndSaveConversation({
    projectId : req.project._id,
    source: 'image',
    rawText: extractedText,
    userId: req.user._id
  });

  res.status(201).json({ success: true, ...result });
};

export const getConversationsByProject = async (req, res) => {
  const conversations = await Conversation.find({ projectId: req.project._id })
    .sort({ createdAt: -1 });
  res.json({ success: true, conversations });
};

//admin
export const deleteConversation = async(req,res)=>{
  const conversation = await Conversation.findOne({
    _id : req.params.id ,
    projectId : req.project._id
   });
    
  if (!conversation) throw new ExpressErr(404, 'Conversation not found');
    
  await Task.deleteMany({ conversationId: conversation._id });
  await Decision.deleteMany({ conversationId: conversation._id });
  await conversation.deleteOne();

  res.json({ success: true, message: 'Conversation deleted' });

}


// member requests deletion
export const reqConversationDeletion =  async(req,res)=>{
  const {reason} = req.body;
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    projectId: req.project._id
  });
  if (!conversation) throw new ExpressErr(404, 'Conversation not found');

  conversation.deletionRequested = true;
  conversation.deletionRequestedBy = req.user._id;
  conversation.deletionReason = reason || null;
  await conversation.save();

  res.json({ success: true, message: 'Deletion requested — awaiting admin approval' });
}


//approves
export const approveConversationDeletion = async (req,res)=>{
   const conversation = await Conversation.findOne({
    _id: req.params.id,
    projectId: req.project._id,
    deletionRequested: true
  });
  if (!conversation) throw new ExpressErr(404, 'No pending deletion request found');

  await Task.deleteMany({ conversationId: conversation._id });
  await Decision.deleteMany({ conversationId: conversation._id });
  await conversation.deleteOne();

  res.json({ success: true, message: 'Conversation deleted (request approved)' });
}

//rejects

export const rejectConversationDeletion = async (req, res) => {
  const conversation = await Conversation.findOneAndUpdate(
    { _id: req.params.id, projectId: req.project._id },
    { deletionRequested: false, deletionRequestedBy: null, deletionReason: null },
    { new: true }
  );
  if (!conversation) throw new ExpressErr(404, 'Conversation not found');

  res.json({ success: true, message: 'Deletion request rejected' });
};
