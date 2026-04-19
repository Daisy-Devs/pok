import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import {
  Asterisk,
  GraduationCap,
  Hospital,
  PawPrint,
  Trees,
  UsersRound,
} from "lucide-react";
import React from "react";

interface SelectCauseProps {
  setCause:(cause: string) => void; 
  cause: string;
}
const SelectCause: React.FC<SelectCauseProps> = ({ setCause, cause }) => {
  const causes = [
    { name: "Environment", icon: <Trees className="text-primary w-5 h-5" /> },
    { name: "Healthcare", icon: <Hospital className="text-primary w-5 h-5" /> },
    {
      name: "Education",
      icon: <GraduationCap className="text-primary w-5 h-5" />,
    },
    {
      name: "Social Justice",
      icon: <UsersRound className="text-primary w-5 h-5" />,
    },
    {
      name: "Disaster Relief",
      icon: <Asterisk className="text-primary w-5 h-5" />,
    },
    {
      name: "Animal Welfare",
      icon: <PawPrint className="text-primary w-5 h-5" />,
    },
  ];

  return (
    <ToggleGroup
      type="single"
      size="lg"
      onValueChange={(selectedCause:string) => setCause(selectedCause)}
      value={cause}
      variant="outline"
      spacing={2}
      className="grid lg:grid-cols-3 grid-cols-2 gap-2 w-full"
    >
      {causes.map((cause) => (
        <ToggleGroupItem
          className="flex flex-col items-center justify-center rounded-xl py-9 bg-background-secondary border-0.5"
          key={cause.name}
          value={cause.name}
        >
          {cause.icon}
          <p className="font-semibold text-secondaryText">{cause.name}</p>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default SelectCause;
