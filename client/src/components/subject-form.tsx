import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DaySelector } from "./day-selector";
import { InsertSubject } from "@shared/schema";
import { getDayName } from "@/lib/date-utils";
import { Plus, Palette } from "lucide-react";

interface SubjectFormProps {
  onAddSubject: (subject: InsertSubject) => void;
}

export function SubjectForm({ onAddSubject }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState("#8B5CF6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: "#8B5CF6", name: "Purple", bg: "bg-purple-500" },
    { value: "#3B82F6", name: "Blue", bg: "bg-blue-500" },
    { value: "#10B981", name: "Green", bg: "bg-green-500" },
    { value: "#F59E0B", name: "Orange", bg: "bg-orange-500" },
    { value: "#EF4444", name: "Red", bg: "bg-red-500" },
    { value: "#8B5A2B", name: "Brown", bg: "bg-amber-700" },
    { value: "#6B7280", name: "Gray", bg: "bg-gray-500" },
    { value: "#EC4899", name: "Pink", bg: "bg-pink-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || selectedDays.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddSubject({
        name: name.trim(),
        schedule: selectedDays,
        lecturesPerDay: 1, // Default to 1, can be adjusted per day in daily view
        color: selectedColor,
      });
      
      // Reset form
      setName("");
      setSelectedDays([]);
      setSelectedColor("#8B5CF6");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScheduleText = () => {
    if (selectedDays.length === 0) return "No days selected";
    return selectedDays
      .sort((a, b) => a - b)
      .map(day => getDayName(day))
      .join(", ");
  };

  return (
    <Card className="shadow-material">
      <CardHeader>
        <CardTitle className="text-lg">Add Subject</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject-name" className="text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </Label>
            <Input
              id="subject-name"
              type="text"
              placeholder="e.g., Mathematics, Physics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              data-testid="input-subject-name"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3">
              Class Days
            </Label>
            <DaySelector
              selectedDays={selectedDays}
              onDaysChange={setSelectedDays}
              className="mb-2"
            />
            {selectedDays.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {getScheduleText()}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="subject-color" className="text-sm font-medium text-gray-700 mb-2">
              Subject Color
            </Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger data-testid="select-subject-color">
                <SelectValue>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: selectedColor }}
                    />
                    {colorOptions.find(c => c.value === selectedColor)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Number of lectures can be adjusted daily in the Today tab
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white shadow-material"
            disabled={!name.trim() || selectedDays.length === 0 || isSubmitting}
            data-testid="button-add-subject"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
