import Conversation from "../models/conversationModel.js";
import Project from "../models/projectModel.js";
import { processCommunication } from "./aiService.js";
import { resolveExtraction } from "./extractionParser.js";

// used by both text and image 
export const processAndSaveConversation = async ({ projectId, source, rawText, userId }) => {
  const conversation = await Conversation.create({
    projectId,
    sourceType: source,
    rawText,
    uploadedBy: userId
  });
 
  let extraction, project;
  try {
     project = await Project.findById(projectId).populate('members.user', 'name');
    if (!project) throw new Error('Project not found');
    const memberNames = project.members.map(m => m.user?.name).filter(Boolean);
    extraction = await processCommunication(rawText, new Date(), memberNames);
  } catch (err) {
    return { conversation, warning: 'Saved but AI extraction failed. You can retry processing later.' };
  }

  const { summary, tasks, decisions } = await resolveExtraction(extraction, projectId, conversation._id);
  conversation.summary = summary;
  conversation.processedAt = new Date();
  await conversation.save();

  return { conversation, tasks, decisions };
};