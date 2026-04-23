import { Asterisk, GraduationCap, Hospital, PawPrint, Trees, UsersRound } from "lucide-react";
import { CauseCategoryType } from "./types";

export const DEFAULT_IMAGE_URL ="https://images.unsplash.com/photo-1692636383649-f3c360c17f07?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export const CAUSE_CATEGORIES: CauseCategoryType[] = [
  { name: "Environment",    icon: Trees          },
  { name: "Healthcare",     icon: Hospital       },
  { name: "Education",      icon: GraduationCap  },
  { name: "Social Justice", icon: UsersRound     },
  { name: "Disaster Relief",icon: Asterisk       },
  { name: "Animal Welfare", icon: PawPrint       },
];
