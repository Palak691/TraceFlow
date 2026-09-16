// conversationController.js
import Conversation from "../models/conversationModel.js";
import { processCommunication } from "../services/aiService.js";
import { resolveExtraction } from "../services/extractionParser.js";
import { extractTextFromImage } from "../services/ocrService.js";
import ExpressErr from "../utlis/ExpressErr.js";

// shared logic — used by both text and image entry points
const processAndSaveConversation = async ({ projectId, source, rawText, userId }) => {
  const conversation = await Conversation.create({
    projectId,
    sourceType: source,
    rawText,
    uploadedBy: userId
  });

  let extraction;
  try {
    extraction = await processCommunication(rawText, new Date());
  } catch (err) {
    return { conversation, warning: 'Saved but AI extraction failed. You can retry processing later.' };
  }

  const { summary, tasks, decisions } = await resolveExtraction(extraction, projectId, conversation._id);
  conversation.summary = summary;
  conversation.processedAt = new Date();
  await conversation.save();

  return { conversation, tasks, decisions };
};

export const createConversation = async (req, res) => {
  const { projectId, source, rawText } = req.body;
  if (!rawText || !projectId) throw new ExpressErr(400, 'projectId and rawText are required');

  const result = await processAndSaveConversation({
    projectId,
    source: source || 'chat',
    rawText,
    userId: req.user._id
  });

  res.status(201).json({ success: true, ...result });
};

export const createConversationFromImage = async (req, res) => {
  const { projectId } = req.body;
  if (!req.file) throw new ExpressErr(400, 'No image uploaded');
  if (!projectId) throw new ExpressErr(400, 'projectId is required');

  let extractedText;
  try {
    extractedText = await extractTextFromImage(req.file.path);
  } catch (err) {
    throw new ExpressErr(400, 'Could not read text from image. Try a clearer screenshot.');
  }

  const result = await processAndSaveConversation({
    projectId,
    source: 'image',
    rawText: extractedText,
    userId: req.user._id
  });

  res.status(201).json({ success: true, ...result });
};

export const getConversationsByProject = async (req, res) => {
  const conversations = await Conversation.find({ projectId: req.params.projectId })
    .sort({ createdAt: -1 });
  res.json({ success: true, conversations });
};