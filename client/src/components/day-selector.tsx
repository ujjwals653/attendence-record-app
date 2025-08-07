import { cn } from '@/lib/utils';
import { getDayShort } from '@/lib/date-utils';

interface DaySelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  className?: string;
  darkMode?: boolean;
}

export function DaySelector({
  selectedDays,
  onDaysChange,
  className,
  darkMode,
}: DaySelectorProps) {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  return (
    <div
      className={cn(
        'grid grid-cols-7 gap-2',
        darkMode ? 'bg-gray-800' : '',
        className
      )}
    >
      {[1, 2, 3, 4, 5, 6, 0].map((day) => {
        // Start with Monday (1) and end with Sunday (0)
        const isSelected = selectedDays.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={cn(
              'w-11 h-11 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
              isSelected
                ? darkMode
                  ? 'border-purple-400 bg-purple-700 text-white'
                  : 'border-purple-500 bg-purple-500 text-white'
                : darkMode
                ? 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-purple-700'
                : 'border-gray-300 hover:bg-purple-50 hover:border-purple-300'
            )}
            data-testid={`day-selector-${day}`}
          >
            {getDayShort(day)}
          </button>
        );
      })}
    </div>
  );
}
