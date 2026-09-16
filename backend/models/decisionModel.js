import mongoose from "mongoose";

const decisionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    decisionText: {
      type: String,
      required: [true, "Decision text is required"],
    },
    type: {
    type: String,
    enum: ['decision', 'approval', 'pending_approval'],
    required: true
  },
  stakeholders: [{ type: String }] ,
    // Used for vector search / RAG in Phase 3
    embedding: {
      type: [Number],
      default: undefined,
    },
  },
  { timestamps: true }
);


decisionSchema.index({ decisionText: 'text' });

const Decision = mongoose.model("Decision" , decisionSchema);
export default Decision;