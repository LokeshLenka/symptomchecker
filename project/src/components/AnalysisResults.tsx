import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Stethoscope, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const getUrgencyConfig = () => {
    switch (result.type) {
      case 'urgent':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertTriangle
        };
      case 'monitor':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: Clock
        };
      case 'routine':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-400',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: CheckCircle
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: Stethoscope
        };
    }
  };

  const config = getUrgencyConfig();
  const IconComponent = config.icon;

  const getUrgencyLabel = () => {
    switch (result.urgencyLevel) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Assessment Complete';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center mb-4">
        <IconComponent className={`h-6 w-6 ${config.iconColor} mr-2`} />
        <div>
          <h3 className={`text-lg font-semibold ${config.textColor}`}>
            Medical Analysis Results
          </h3>
          <span className={`text-sm ${config.textColor} opacity-75`}>
            {getUrgencyLabel()}
          </span>
        </div>
      </div>
      
      <div className={`mb-4 ${config.textColor}`}>
        <p className="text-base leading-relaxed">{result.message}</p>
      </div>
      
      {result.possibleConditions && result.possibleConditions.length > 0 && (
        <div className="mb-4">
          <h4 className={`font-medium mb-2 ${config.textColor} flex items-center`}>
            <Stethoscope className="h-4 w-4 mr-1" />
            Possible Conditions to Discuss with Your Doctor:
          </h4>
          <ul className={`list-disc list-inside space-y-1 ${config.textColor} opacity-90 text-sm`}>
            {result.possibleConditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className={`font-medium mb-2 ${config.textColor}`}>
          Recommended Actions:
        </h4>
        <ul className={`list-disc list-inside space-y-1 ${config.textColor} opacity-90`}>
          {result.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className={`mt-4 p-3 bg-white bg-opacity-50 rounded border ${config.textColor} text-sm`}>
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>{result.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};