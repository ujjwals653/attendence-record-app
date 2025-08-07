import { GraduationCap, Bell, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SubjectForm } from './subject-form';
import { Subject, InsertSubject } from '@shared/schema';
import { getDayName } from '@/lib/date-utils';
import { useNotifications } from '@/hooks/use-notifications';

interface SetupScreenProps {
  subjects: Subject[];
  onAddSubject: (subject: InsertSubject) => void;
  onRemoveSubject: (subjectId: string) => void;
  onEditSubject: (subjectId: string, updates: Partial<InsertSubject>) => void;
  darkMode?: boolean;
}

export function SetupScreen({
  subjects,
  onAddSubject,
  onRemoveSubject,
  onEditSubject,
  darkMode,
}: SetupScreenProps) {
  const { settings, toggleNotifications, requestPermission } =
    useNotifications();
  
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const handleDelete = (subject: Subject) => {
    setDeletingSubject(subject);
  };

  const confirmDelete = () => {
    if (deletingSubject) {
      onRemoveSubject(deletingSubject.id);
      setDeletingSubject(null);
    }
  };

  const getScheduleText = (schedule: number[]) => {
    return schedule
      .sort((a, b) => a - b)
      .map((day) => getDayName(day))
      .join(', ');
  };

  return (
    <div
      className={`p-4 space-y-6 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Welcome Section */}
      <div className="text-center py-8">
        <GraduationCap
          className={`w-16 h-16 mx-auto mb-4 ${
            darkMode ? 'text-purple-400' : 'text-primary'
          }`}
        />
        <h2
          className={`text-2xl font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Welcome to AttendanceTracker
        </h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Let's set up your subjects and schedule
        </p>
      </div>

      {/* Subject Form */}
      <SubjectForm onAddSubject={onAddSubject} darkMode={darkMode} />

      {/* Subjects List */}
      {subjects.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : ''}`}>
            Your Subjects
          </h3>
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className={`shadow-material border-l-4 ${
                darkMode ? 'bg-gray-800' : ''
              }`}
              style={{ borderLeftColor: subject.color }}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  {editingSubject === subject.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={subject.color}
                          onChange={(e) => onEditSubject(subject.id, { color: e.target.value })}
                          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                          title="Choose subject color"
                        />
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => onEditSubject(subject.id, { name: e.target.value })}
                          className={`flex-1 px-2 py-1 rounded ${
                            darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                          }`}
                          placeholder="Subject name"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[0,1,2,3,4,5,6].map(day => (
                          <label
                            key={day}
                            className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer ${
                              darkMode 
                                ? subject.schedule.includes(day) 
                                  ? 'bg-purple-700 text-white'
                                  : 'bg-gray-700 text-gray-300'
                                : subject.schedule.includes(day)
                                  ? 'bg-purple-100 text-purple-900'
                                  : 'bg-gray-100 text-gray-700'
                            } hover:opacity-90 transition-colors`}
                          >
                            <input
                              type="checkbox"
                              checked={subject.schedule.includes(day)}
                              onChange={(e) => {
                                const newSchedule = e.target.checked
                                  ? [...subject.schedule, day]
                                  : subject.schedule.filter(d => d !== day);
                                onEditSubject(subject.id, { schedule: newSchedule.sort() });
                              }}
                              className="hidden"
                            />
                            <span className="text-sm font-medium">
                              {getDayName(day).slice(0, 3)}
                            </span>
                          </label>
                        ))}
                      </div>
                      <select
                        value={subject.lecturesPerDay}
                        onChange={(e) => onEditSubject(subject.id, { lecturesPerDay: Number(e.target.value) })}
                        className={`w-full px-2 py-1 rounded ${
                          darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                        }`}
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} lecture{num > 1 ? 's' : ''} per day</option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        onClick={() => setEditingSubject(null)}
                        className={`w-full ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-secondary'
                        }`}
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h4
                        className={`font-medium ${darkMode ? 'text-white' : ''}`}
                        data-testid={`text-subject-${subject.id}`}
                      >
                        {subject.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {getScheduleText(subject.schedule)}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        {subject.lecturesPerDay === 1
                          ? '1 lecture per day'
                          : `${subject.lecturesPerDay} lectures per day`}
                      </p>
                    </div>
                  )}
                </div>
                {editingSubject !== subject.id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSubject(subject.id)}
                      className={
                        darkMode
                          ? 'text-blue-400 hover:bg-gray-700'
                          : 'text-blue-500 hover:bg-blue-50'
                      }
                      data-testid={`button-edit-${subject.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subject)}
                      className={
                        darkMode
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-500 hover:bg-red-50'
                      }
                      data-testid={`button-remove-${subject.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingSubject !== null} onOpenChange={() => setDeletingSubject(null)}>
        <DialogContent className={darkMode ? 'bg-gray-800 text-white' : ''}>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Are you sure you want to delete {deletingSubject?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => setDeletingSubject(null)}
              className={darkMode ? 'hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className={darkMode ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Setup */}
      <Card
        className={`shadow-material ${
          darkMode ? 'bg-gray-800 text-white' : ''
        }`}
      >
        <CardHeader>
          <CardTitle className={`text-lg ${darkMode ? 'text-white' : ''}`}>
            Daily Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                Enable notifications
              </Label>
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
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
              className={`w-full shadow-material ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-secondary hover:bg-cyan-500 text-gray-900'
              }`}
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
