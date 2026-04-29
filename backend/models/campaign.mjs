import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  name: String,
  url: String,
  public_id: String,
  type: String
}, { _id: false });

const CampaignSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    campaignIdBytes32: { type: String, required: true, index: true },
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
      type: [DocumentSchema],
      default: []
    },
    goalAmount: { type: Number, required: true },
    goalToken: {
      type: String,
      enum: ["ETH", "USDC", "USDT", "DAI"],
      required: true
    },
    raisedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed'],
      default: 'draft'
    },
    txHash: { type: String, unique: true },
    onChain: { type: Boolean, default: false },
    onChainStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    retryCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Campaign = mongoose.model('Campaign', CampaignSchema);