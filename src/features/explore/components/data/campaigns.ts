import { Campaign } from "../../types";

export const campaigns: Campaign[] = [
 
  {
    id: 1,
    category: "ENVIRONMENT",
    title: "Reforest the Amazon",
    description:
      "Direct funding to indigenous communities to plant and protect 1 million native trees across the Brazilian Amazon basin.",
    progress: 72,
    raised: "142.5",
    currency: "ETH",
    image:
"/causes/tree.png"  },
  {
    id: 2,
    category: "EDUCATION",
    title: "Clean Water for Rural Schools",
    description:
      "Installing solar-powered filtration systems in 50 sub-Saharan primary schools.",
    progress: 48,
    raised: "85,400",
    currency: "USDC",
    image:
"/causes/education.png"   },
  {
    id: 3,
    category: "HEALTH",
    title: "Mobile Dental Clinics",
    description:
      "Providing free emergency dental care to remote coastal communities using mobile clinic units.",
    progress: 92,
    raised: "12.8",
    currency: "ETH",
    image:
"/causes/ocean.png"   },
  {
    id: 4,
    category: "DISASTER RELIEF",
    title: "Earthquake Rapid Response",
    description:
      "Emergency food, medicine, and shelter for regions recently affected by seismic events.",
    progress: 15,
    raised: "45,000",
    currency: "USDC",
    image:
"/causes/save.png"   },
];
 