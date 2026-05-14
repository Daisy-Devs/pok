"use client";


import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by cause, location, or tag...",
}: SearchBarProps) {
  return (
    <div className="w-full  ">
      <Input
        className="border border-border rounded-lg text-"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="lg"
        leftElement={<Search size={18} />}
      />
    </div>
  );
}
