import Task from "../models/taskModel.js";
import Decision from "../models/decisionModel.js";
import Project from "../models/projectModel.js";

const matchAssignee = (name, members) => {
  if (!name) return { assignee: null, assigneeRaw: null };

  const normalized = name.trim().toLowerCase();

  const match = members.find((m) => {
    const memberName = m.user?.name?.trim().toLowerCase();

    return (
      memberName === normalized ||
      memberName?.includes(normalized) ||
      normalized.includes(memberName)
    );
  });

  return match
    ? {
        assignee: match.user._id,
        assigneeRaw: null
      }
    : {
        assignee: null,
        assigneeRaw: name
      };
};

const parseDeadline = (dateStr) => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const resolveExtraction = async (extraction, projectId, conversationId) => {
  console.log("RAW AI EXTRACTION:", JSON.stringify(extraction, null, 2)); // temporary debug

;
  console.log("ALL PROJECTS:", await Project.find({}, "_id name"));
  const { summary, tasks = [], decisions = [] } = extraction;

  const project = await Project.findById(projectId).populate('members.user', 'name');
  
  if (!project) throw new Error('Project not found during extraction resolution');

  const createdTasks = await Promise.all(
    tasks.map(async (t) => {  
    
      const { assignee, assigneeRaw } = matchAssignee(t.assignee, project.members);
    
    console.log("RESOLVED:", { assignee, assigneeRaw, deadline: parseDeadline(t.deadline) })
      return Task.create({
        projectId,
        conversationId,
        title: t.title,
        assignee,
        assigneeRaw,
        deadline: parseDeadline(t.deadline),
        status: 'pending'
      });
    })
  );

  const createdDecisions = await Promise.all(
    decisions.map((d) =>
      Decision.create({
        projectId,
        conversationId,
        decisionText: d.text,
        type: d.type
      })
    )
  );

  return { summary, tasks: createdTasks, decisions: createdDecisions };
};