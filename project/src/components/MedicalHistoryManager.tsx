import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Edit3,
  Trash2,
  Info
} from 'lucide-react';
import { MedicalHistory } from '../types';

interface Props {
  medicalHistory: MedicalHistory[];
  onAddHistory: (history: MedicalHistory) => void;
  onUpdateHistory: (id: string, history: Partial<MedicalHistory>) => void;
  onRemoveHistory: (id: string) => void;
}

export const MedicalHistoryManager: React.FC<Props> = ({
  medicalHistory,
  onAddHistory,
  onUpdateHistory,
  onRemoveHistory
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'current' | 'resolved' | 'chronic'>('all');

  const generateId = () => `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'current':
        return {
          color: 'text-blue-800',
          bgColor: 'bg-blue-100',
          icon: Activity,
          label: 'Current'
        };
      case 'resolved':
        return {
          color: 'text-green-800',
          bgColor: 'bg-green-100',
          icon: CheckCircle,
          label: 'Resolved'
        };
      case 'chronic':
        return {
          color: 'text-orange-800',
          bgColor: 'bg-orange-100',
          icon: Clock,
          label: 'Chronic'
        };
      default:
        return {
          color: 'text-gray-800',
          bgColor: 'bg-gray-100',
          icon: Info,
          label: 'Unknown'
        };
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'severe':
        return {
          color: 'text-red-800',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300'
        };
      case 'moderate':
        return {
          color: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300'
        };
      case 'mild':
        return {
          color: 'text-green-800',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300'
        };
      default:
        return {
          color: 'text-gray-800',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300'
        };
    }
  };

  const filteredHistory = medicalHistory.filter(history => 
    filter === 'all' || history.status === filter
  );

  const getStats = () => {
    const total = medicalHistory.length;
    const current = medicalHistory.filter(h => h.status === 'current').length;
    const chronic = medicalHistory.filter(h => h.status === 'chronic').length;
    const resolved = medicalHistory.filter(h => h.status === 'resolved').length;
    
    return { total, current, chronic, resolved };
  };

  const stats = getStats();

  const handleSubmit = (formData: Omit<MedicalHistory, 'id'>) => {
    if (editingId) {
      onUpdateHistory(editingId, formData);
      setEditingId(null);
    } else {
      onAddHistory({
        ...formData,
        id: generateId()
      });
    }
    setShowAddForm(false);
  };

  const handleEdit = (history: MedicalHistory) => {
    setEditingId(history.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medical history entry?')) {
      onRemoveHistory(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900">Medical History</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Condition
        </button>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Current</p>
                <p className="text-2xl font-bold text-orange-900">{stats.current}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Chronic</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.chronic}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {medicalHistory.length > 0 && (
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'current', 'chronic', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Medical History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((history) => {
            const statusConfig = getStatusConfig(history.status);
            const severityConfig = getSeverityConfig(history.severity);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={history.id}
                className={`bg-white border-l-4 ${severityConfig.borderColor} rounded-lg shadow-sm hover:shadow-md transition-shadow p-6`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {history.condition}
                      </h3>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${severityConfig.bgColor} ${severityConfig.color}`}>
                        {history.severity}
                      </div>
                    </div>
                    
                    {history.description && (
                      <p className="text-gray-600 mb-3">{history.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {history.diagnosisDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Diagnosed: {formatDate(history.diagnosisDate)}</span>
                        </div>
                      )}
                      {history.treatment && (
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          <span>Treatment: {history.treatment}</span>
                        </div>
                      )}
                    </div>
                    
                    {history.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {history.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(history)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(history.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No medical history recorded' : `No ${filter} conditions`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Start by adding your first medical condition or diagnosis.'
              : `No conditions found with status: ${filter}`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Condition
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <MedicalHistoryForm
          editingHistory={editingId ? medicalHistory.find(h => h.id === editingId) : undefined}
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

// Medical History Form Component
interface FormProps {
  editingHistory?: MedicalHistory;
  onSubmit: (history: Omit<MedicalHistory, 'id'>) => void;
  onCancel: () => void;
}

const MedicalHistoryForm: React.FC<FormProps> = ({ editingHistory, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    condition: editingHistory?.condition || '',
    description: editingHistory?.description || '',
    diagnosisDate: editingHistory?.diagnosisDate || '',
    status: editingHistory?.status || 'current',
    severity: editingHistory?.severity || 'mild',
    treatment: editingHistory?.treatment || '',
    notes: editingHistory?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.condition.trim()) return;
    
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingHistory ? 'Edit Medical History' : 'Add Medical History'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Hypertension, Diabetes Type 2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Brief description of the condition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis Date
                </label>
                <input
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => handleChange('diagnosisDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="current">Current</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment
                </label>
                <input
                  type="text"
                  value={formData.treatment}
                  onChange={(e) => handleChange('treatment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Current treatment or medication"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Additional notes or observations"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingHistory ? 'Update' : 'Add'} Condition
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};