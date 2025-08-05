import { GraduationCap, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubjectForm } from "./subject-form";
import { Subject, InsertSubject } from "@shared/schema";
import { getDayName } from "@/lib/date-utils";
import { useNotifications } from "@/hooks/use-notifications";

interface SetupScreenProps {
  subjects: Subject[];
  onAddSubject: (subject: InsertSubject) => void;
  onRemoveSubject: (subjectId: string) => void;
}

export function SetupScreen({ subjects, onAddSubject, onRemoveSubject }: SetupScreenProps) {
  const { settings, toggleNotifications, requestPermission } = useNotifications();

  const getScheduleText = (schedule: number[]) => {
    return schedule
      .sort((a, b) => a - b)
      .map(day => getDayName(day))
      .join(", ");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Welcome to AttendanceTracker
        </h2>
        <p className="text-gray-600">Let's set up your subjects and schedule</p>
      </div>

      {/* Subject Form */}
      <SubjectForm onAddSubject={onAddSubject} />

      {/* Subjects List */}
      {subjects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Your Subjects</h3>
          {subjects.map((subject) => (
            <Card key={subject.id} className="shadow-material">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium" data-testid={`text-subject-${subject.id}`}>
                    {subject.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getScheduleText(subject.schedule)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSubject(subject.id)}
                  className="text-red-500 hover:bg-red-50"
                  data-testid={`button-remove-${subject.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification Setup */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Daily Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable notifications</Label>
              <p className="text-sm text-gray-600">
                Get reminded to mark attendance at 7 PM
              </p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={toggleNotifications}
              data-testid="switch-notifications"
            />
          </div>
          
          {!settings.notificationsEnabled && (
            <Button
              onClick={requestPermission}
              className="w-full bg-secondary hover:bg-cyan-500 text-gray-900 shadow-material"
              data-testid="button-request-permission"
            >
              <Bell className="w-4 h-4 mr-2" />
              Request Permission
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
