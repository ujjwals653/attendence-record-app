import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AttendanceToggleProps {
  present: boolean;
  onToggle: (present: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function AttendanceToggle({ present, onToggle, className, disabled }: AttendanceToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm text-gray-600">Absent</span>
      <Switch
        checked={present}
        onCheckedChange={onToggle}
        disabled={disabled}
        className="data-[state=checked]:bg-green-500"
        data-testid="attendance-toggle"
      />
      <span className="text-sm text-gray-600">Present</span>
    </div>
  );
}
