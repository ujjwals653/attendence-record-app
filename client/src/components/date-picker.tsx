import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  className?: string;
  darkMode?: boolean;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  className,
  darkMode,
}: DatePickerProps) {
  const date = parseISO(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const formattedDate = format(newDate, 'yyyy-MM-dd');
      onDateChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            darkMode
              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50',
            className
          )}
          data-testid="button-date-picker"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {format(date, 'PPP')}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-auto p-0',
          darkMode
            ? 'bg-gray-900 text-white border-gray-700'
            : 'bg-white text-gray-900 border-gray-200'
        )}
        align="start"
      >
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
