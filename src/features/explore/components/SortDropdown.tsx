import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export default function SortDropdown() {
  return (
    <Select defaultValue="recent">
      <SelectTrigger className="w-36 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Most Recent</SelectItem>
        <SelectItem value="funded">Most Funded</SelectItem>
        <SelectItem value="urgent">Most Urgent</SelectItem>
      </SelectContent>
    </Select>
  );
}