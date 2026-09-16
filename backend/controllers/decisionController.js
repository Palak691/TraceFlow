import Decision from "../models/decisionModel.js";


export const getDecisionsByProject = async (req, res) => {
  const decisions = await Decision.find({ projectId: req.params.projectId })
    .sort({ createdAt: -1 });
  res.json({ success: true, decisions });
};