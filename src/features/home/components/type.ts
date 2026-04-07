type Tag = {
  label: string;
  variant: "indigo" | "green";
};

type Cause = {
  title: string;
  description: string;
  raised: string;
  percentage: number;
  image?: string; // ✅ add this
  tags: Tag[];
};