import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    campaignIdBytes32: { type: String, required: true, unique: true, index: true },
    // Reference to organization
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    title: { type: String, required: true },
    missionStatement: { type: String, required: true },
    cause: { type: String, required: true },
    imageUrl: {
      type: [String],
      default: []
    },
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

export const Campaign = mongoose.model('Campaign', CampaignSchema);