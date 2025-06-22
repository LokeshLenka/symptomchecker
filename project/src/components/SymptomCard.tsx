import React from 'react';
import { Trash2, Clock, MapPin } from 'lucide-react';
import { Symptom } from '../types';

interface SymptomCardProps {
  symptom: Symptom;
  index: number;
  onUpdate: (id: string, field: keyof Symptom, value: string | number) => void;
  onRemove: (id: string) => void;
  commonLocations: string[];
}

export const SymptomCard: React.FC<SymptomCardProps> = ({
  symptom,
  index,
  onUpdate,
  onRemove,
  commonLocations
}) => {
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-green-500';
    if (severity <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return 'Mild';
    if (severity <= 6) return 'Moderate';
    return 'Severe';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 relative bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-medium text-gray-900">
            {symptom.description || `Symptom ${index + 1}`}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(symptom.severity)}`}>
            {getSeverityLabel(symptom.severity)}
          </span>
        </div>
        <button
          onClick={() => onRemove(symptom.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Remove symptom"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={symptom.description}
            onChange={(e) => onUpdate(symptom.id, 'description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your symptom (e.g., headache, nausea, chest pain)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity (1-10)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="10"
                value={symptom.severity}
                onChange={(e) => onUpdate(symptom.id, 'severity', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getSeverityColor(symptom.severity)} 0%, ${getSeverityColor(symptom.severity)} ${(symptom.severity - 1) * 11.11}%, #e5e7eb ${(symptom.severity - 1) * 11.11}%, #e5e7eb 100%)`
                }}
              />
              <span className="w-8 text-center font-medium text-gray-900">
                {symptom.severity}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Duration (hours)
          </label>
          <input
            type="number"
            min="0"
            value={symptom.durationHours || ''}
            onChange={(e) => onUpdate(symptom.id, 'durationHours', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="How long have you had this symptom?"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={symptom.location}
              onChange={(e) => onUpdate(symptom.id, 'location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where do you feel this symptom?"
              list={`locations-${symptom.id}`}
            />
            <datalist id={`locations-${symptom.id}`}>
              {commonLocations.map(location => (
                <option key={location} value={location} />
              ))}
            </datalist>
            {commonLocations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-500 mr-2">Quick select:</span>
                {commonLocations.slice(0, 4).map(location => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => onUpdate(symptom.id, 'location', location)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={symptom.category}
            onChange={(e) => onUpdate(symptom.id, 'category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            placeholder="Symptom category"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};