import React from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Info,
  Heart,
  Shield,
  Stethoscope,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { AnalysisResult } from "../types";

interface Props {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<Props> = ({ result }) => {
  const getUrgencyConfig = (urgencyLevel: string, type: string) => {
    if (type === "urgent" || urgencyLevel === "high") {
      return {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        iconColor: "text-red-600",
        icon: AlertTriangle,
        title: "Urgent Medical Attention Required",
        description: "Please seek immediate medical care",
      };
    } else if (type === "monitor" || urgencyLevel === "medium") {
      return {
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-600",
        icon: Clock,
        title: "Monitor Symptoms Closely",
        description: "Keep track of symptoms and consider seeing a doctor",
      };
    } else {
      return {
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-600",
        icon: CheckCircle,
        title: "Routine Care Recommended",
        description: "Symptoms appear manageable with basic care",
      };
    }
  };

  const urgencyConfig = getUrgencyConfig(result.urgencyLevel, result.type);
  const UrgencyIcon = urgencyConfig.icon;

  return (
    <div className="space-y-6">
      {/* Urgency Alert */}
      <div
        className={`${urgencyConfig.bgColor} ${urgencyConfig.borderColor} border-2 rounded-xl p-6`}
      >
        <div className="flex items-start space-x-4">
          <div className={`${urgencyConfig.iconColor} mt-1`}>
            <UrgencyIcon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${urgencyConfig.textColor} mb-2`}>
              {urgencyConfig.title}
            </h3>
            <p className={`${urgencyConfig.textColor} mb-3 text-lg`}>
              {urgencyConfig.description}
            </p>
            <div
              className={`${urgencyConfig.textColor} bg-white bg-opacity-70 rounded-lg p-4`}
            >
              <p className="font-medium">{result.message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Possible Conditions */}
        {result.possibleConditions && result.possibleConditions.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Stethoscope className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-purple-900">
                Possible Conditions Detected By AI
              </h3>
            </div>
            <div className="space-y-3">
              {result.possibleConditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Info className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-purple-800 font-medium">{condition}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-purple-700 text-sm font-medium">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                These are potential conditions based on reported symptoms. Only
                a healthcare professional can provide an accurate diagnosis.
              </p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-blue-900">
              Recommended Actions
            </h3>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-semibold text-indigo-900">
            Next Steps & Timeline
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-indigo-900 mb-1">Immediate</h4>
            <p className="text-indigo-700 text-sm">
              Follow emergency recommendations if urgent
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-indigo-900 mb-1">Short-term</h4>
            <p className="text-indigo-700 text-sm">
              Monitor symptoms and apply self-care measures
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-indigo-900 mb-1">Follow-up</h4>
            <p className="text-indigo-700 text-sm">
              Schedule medical consultation if needed
            </p>
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Medical Disclaimer
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.disclaimer}</p>
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Always trust your instincts. If you feel something is seriously
                wrong, seek immediate medical attention regardless of this
                analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
