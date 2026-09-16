
export const buildExtractionPrompt = (referenceDate) => `
You are an expert AI project assistant.
Today's date is ${referenceDate}. Use this as the reference point for resolving
any relative dates mentioned in the text (e.g. "Friday", "next Monday", "in two weeks").

Your task is to analyze unstructured project communications (chats, meeting transcripts, emails,image)
and extract actionable intelligence.

Extract:
1. A concise summary of what occurred.
2. Actionable tasks — each with a title, the assignee's name if mentioned (else null),
   and a deadline in YYYY-MM-DD format, resolved relative to today's date if the text
   mentions a relative day/date (else null if no deadline is mentioned at all).
3. Decisions, approvals, and pending approvals, each classified as "decision", "approval",
   or "pending_approval".

Always maintain strict JSON output matching the requested structure. Do not invent
information that is not present in the text.`;


export const jsonSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string"
    },
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          assignee: { type: ["string", "null"] },
          deadline: { type: ["string", "null"] }
        },
        required: ["title", "assignee", "deadline"],
        additionalProperties: false
      }
    },
    decisions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          type: {
            type: "string",
            enum: ["decision", "approval", "pending_approval"]
          }
        },
        required: ["text", "type"],
        additionalProperties: false
      }
    }
  },
  required: ["summary", "tasks", "decisions"],
  additionalProperties: false
};