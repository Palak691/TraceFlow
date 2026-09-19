import Conversation from "../models/conversationModel.js";
import { processAndSaveConversation } from "../aiServices/conversationService.js";
import { extractTextFromImage } from "../services/ocrService.js";
import ExpressErr from "../utlis/ExpressErr.js";



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