export interface Campaign {
  id: number;
  category: "ENVIRONMENT" | "EDUCATION" | "HEALTH" | "DISASTER RELIEF";
  title: string;
  description: string;
  progress: number;
  raised: string;
  currency: string;
  image: string;
}