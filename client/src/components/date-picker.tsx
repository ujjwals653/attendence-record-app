import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  className?: string;
}

export function DatePicker({ selectedDate, onDateChange, className }: DatePickerProps) {
  const date = parseISO(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const formattedDate = format(newDate, "yyyy-MM-dd");
      onDateChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            className
          )}
          data-testid="button-date-picker"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {format(date, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          data-testid="calendar"
        />
      </PopoverContent>
    </Popover>
  );
}