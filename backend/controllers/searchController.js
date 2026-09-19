import ExpressErr from "../utlis/ExpressErr.js";
import Conversation from "../models/conversationModel.js";
import Task from "../models/taskModel.js";
import Decision from "../models/decisionModel.js";

export const search = async (req, res) => {
   const { q } = req.query;

   if (!q || !q.trim()) {
    throw new ExpressErr(400, 'Search query is required');
   }

  const projectId = req.project._id;

  const [conversations, tasks, decisions] = await Promise.all([

    Conversation.find({projectId, $text: { $search: q } }).limit(10),

    Task.find({ projectId, $text: { $search: q }})
      .populate('assignee', 'name email')
      .limit(10),

    Decision.find({ projectId, $text: { $search: q }}).limit(10)

  ]);

  res.json({success: true,  results: {conversations, tasks, decisions}});
  
};