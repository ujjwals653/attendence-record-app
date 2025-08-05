import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DaySelector } from "./day-selector";
import { InsertSubject } from "@shared/schema";
import { getDayName } from "@/lib/date-utils";
import { Plus } from "lucide-react";

interface SubjectFormProps {
  onAddSubject: (subject: InsertSubject) => void;
}

export function SubjectForm({ onAddSubject }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      });
      
      // Reset form
      setName("");
      setSelectedDays([]);
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
