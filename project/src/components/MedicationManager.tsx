import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Clock, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Trash2,
  Calendar,
  Timer
} from 'lucide-react';
import { Medication, NotificationReminder } from '../types';

interface Props {
  medications: Medication[];
  onAddMedication: (medication: Medication) => void;
  onUpdateMedication: (id: string, medication: Partial<Medication>) => void;
  onRemoveMedication: (id: string) => void;
  onMarkTaken: (medicationId: string) => void;
}

export const MedicationManager: React.FC<Props> = ({
  medications,
  onAddMedication,
  onUpdateMedication,
  onRemoveMedication,
  onMarkTaken
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateId = () => `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getUpcomingReminders = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().slice(0, 5);

    return medications
      .filter(med => med.isActive && med.reminderEnabled)
      .flatMap(med => 
        med.times.map(time => ({
          medication: med,
          time,
          isPast: time < currentTimeStr,
          isNow: Math.abs(new Date(`${today}T${time}`).getTime() - now.getTime()) < 30 * 60 * 1000 // Within 30 minutes
        }))
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleSubmit = (formData: Omit<Medication, 'id'>) => {
    if (editingId) {
      onUpdateMedication(editingId, formData);
      setEditingId(null);
    } else {
      onAddMedication({
        ...formData,
        id: generateId()
      });
    }
    setShowAddForm(false);
  };

  const upcomingReminders = getUpcomingReminders();
  const todayReminders = upcomingReminders.filter(r => !r.isPast);
  const overdueReminders = upcomingReminders.filter(r => r.isPast);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Pill className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900">Medication Manager</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </button>
      </div>

      {/* Today's Reminders */}
      {(todayReminders.length > 0 || overdueReminders.length > 0) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-blue-900">Today's Reminders</h3>
          </div>

          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Overdue ({overdueReminders.length})
              </h4>
              <div className="space-y-2">
                {overdueReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                      <div>
                        <p className="font-medium text-red-900">{reminder.medication.name}</p>
                        <p className="text-sm text-red-700">{reminder.medication.dosage} at {reminder.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onMarkTaken(reminder.medication.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Mark Taken
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {todayReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Upcoming ({todayReminders.length})
              </h4>
              <div className="space-y-2">
                {todayReminders.slice(0, 3).map((reminder, index) => (
                  <div key={index} className={`flex items-center justify-between rounded-lg p-3 transition-all duration-200 ${
                    reminder.isNow 
                      ? 'bg-yellow-50 border border-yellow-300 animate-pulse' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        reminder.isNow ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{reminder.medication.name}</p>
                        <p className="text-sm text-gray-600">{reminder.medication.dosage} at {reminder.time}</p>
                      </div>
                    </div>
                    {reminder.isNow && (
                      <button
                        onClick={() => onMarkTaken(reminder.medication.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Take Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medications List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Medications</h3>
        
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No medications added yet.</p>
            <p className="text-sm mt-1">Add your first medication to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      medication.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <h4 className="text-lg font-semibold text-gray-900">{medication.name}</h4>
                    {!medication.isActive && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(medication.id);
                        setShowAddForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemoveMedication(medication.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Dosage</p>
                    <p className="font-medium">{medication.dosage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Frequency</p>
                    <p className="font-medium capitalize">{medication.frequency.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Times</p>
                    <p className="font-medium">{medication.times.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reminders</p>
                    <p className="font-medium">{medication.reminderEnabled ? 'On' : 'Off'}</p>
                  </div>
                </div>
                
                {medication.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{medication.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Medication Modal */}
      {showAddForm && (
        <MedicationForm
          medication={editingId ? medications.find(m => m.id === editingId) : undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
};

// Medication Form Component
interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (medication: Omit<Medication, 'id'>) => void;
  onCancel: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ medication, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    name: medication?.name || '',
    dosage: medication?.dosage || '',
    frequency: medication?.frequency || 'once',
    times: medication?.times || ['08:00'],
    startDate: medication?.startDate || new Date().toISOString().split('T')[0],
    endDate: medication?.endDate || '',
    notes: medication?.notes || '',
    isActive: medication?.isActive ?? true,
    reminderEnabled: medication?.reminderEnabled ?? true,
    lastTaken: medication?.lastTaken
  });

  const frequencyTimeMap = {
    'once': 1,
    'twice': 2,
    'thrice': 3,
    'four-times': 4,
    'as-needed': 1
  };

  useEffect(() => {
    const timeCount = frequencyTimeMap[formData.frequency];
    const newTimes = [...formData.times];
    
    if (newTimes.length < timeCount) {
      // Add more times
      while (newTimes.length < timeCount) {
        newTimes.push('12:00');
      }
    } else if (newTimes.length > timeCount) {
      // Remove excess times
      newTimes.splice(timeCount);
    }
    
    setFormData(prev => ({ ...prev, times: newTimes }));
  }, [formData.frequency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {medication ? 'Edit Medication' : 'Add New Medication'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter medication name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., 500mg, 1 tablet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="once">Once daily</option>
                <option value="twice">Twice daily</option>
                <option value="thrice">Three times daily</option>
                <option value="four-times">Four times daily</option>
                <option value="as-needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Times
              </label>
              <div className="space-y-2">
                {formData.times.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...formData.times];
                      newTimes[index] = e.target.value;
                      setFormData(prev => ({ ...prev, times: newTimes }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Any additional notes or instructions"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.reminderEnabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Reminders</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {medication ? 'Update' : 'Add'} Medication
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};