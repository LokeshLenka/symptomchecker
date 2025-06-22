import React, { useState, useEffect } from "react";
import {
  Plus,
  Activity,
  User,
  AlertTriangle,
  FileText,
  Menu,
  Pill,
} from "lucide-react";
import {
  Symptom,
  PatientData,
  AnalysisResult,
  SymptomTemplate,
  MedicalHistory,
  Medication,
} from "./types";
import { symptomDatabase } from "./data/symptomDatabase";
import { SymptomSelector } from "./components/SymptomSelector";
import { SymptomCard } from "./components/SymptomCard";
import { AnalysisResults } from "./components/AnalysisResults";
import { MedicalHistoryManager } from "./components/MedicalHistoryManager";
import { MedicationManager } from "./components/MedicationManager";
import { analyzeSymptoms } from "./services/aiService";

// Navigation tabs type
type TabType = "symptoms" | "history" | "medications";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("symptoms");

  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: "",
    symptoms: [],
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const [analysisError, setAnalysisError] = useState<string>("");

  // Load data from localStorage on mount
  useEffect(() => {
    // Load symptom checker data
    const savedData = localStorage.getItem("medicalSymptomChecker");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPatientData(parsedData);
      } catch (error) {
        console.error("Error loading saved symptom data:", error);
      }
    }

    // Load medical history data
    const savedHistory = localStorage.getItem("medicalHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setMedicalHistory(parsedHistory);
      } catch (error) {
        console.error("Error loading saved medical history:", error);
      }
    }

    // Load medications data
    const savedMedications = localStorage.getItem("medications");
    if (savedMedications) {
      try {
        const parsedMedications = JSON.parse(savedMedications);
        setMedications(parsedMedications);
      } catch (error) {
        console.error("Error loading saved medications:", error);
      }
    }
  }, []);

  // Save symptom data to localStorage whenever patient data changes
  useEffect(() => {
    localStorage.setItem("medicalSymptomChecker", JSON.stringify(patientData));
  }, [patientData]);

  // Save medical history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("medicalHistory", JSON.stringify(medicalHistory));
  }, [medicalHistory]);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  const generateId = () =>
    `symptom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const updatePatientInfo = (
    field: keyof Pick<PatientData, "age" | "gender">,
    value: string | number
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCustomSymptom = () => {
    const newSymptom: Symptom = {
      id: generateId(),
      description: "",
      severity: 1,
      durationHours: 0,
      location: "",
      category: "Custom",
    };

    setPatientData((prev) => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom],
    }));
  };

  const addSymptomFromDatabase = (symptomTemplate: SymptomTemplate) => {
    const newSymptom: Symptom = {
      id: generateId(),
      description: symptomTemplate.name,
      severity: 1,
      durationHours: 0,
      location: symptomTemplate.commonLocations[0] || "",
      category: symptomTemplate.category,
    };

    setPatientData((prev) => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom],
    }));
  };

  const removeSymptom = (id: string) => {
    setPatientData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((symptom) => symptom.id !== id),
    }));
  };

  const updateSymptom = (
    id: string,
    field: keyof Symptom,
    value: string | number
  ) => {
    setPatientData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom) =>
        symptom.id === id ? { ...symptom, [field]: value } : symptom
      ),
    }));
  };

  const getCommonLocations = (symptomDescription: string): string[] => {
    const matchingTemplate = symptomDatabase.find(
      (template) =>
        template.name.toLowerCase() === symptomDescription.toLowerCase()
    );
    return matchingTemplate?.commonLocations || [];
  };

  // Medical History handlers
  const handleAddHistory = (history: MedicalHistory) => {
    setMedicalHistory((prev) => [...prev, history]);
  };

  const handleUpdateHistory = (
    id: string,
    updatedHistory: Partial<MedicalHistory>
  ) => {
    setMedicalHistory((prev) =>
      prev.map((history) =>
        history.id === id ? { ...history, ...updatedHistory } : history
      )
    );
  };

  const handleRemoveHistory = (id: string) => {
    setMedicalHistory((prev) => prev.filter((history) => history.id !== id));
  };

  // Medication handlers
  const handleAddMedication = (medication: Medication) => {
    setMedications((prev) => [...prev, medication]);
  };

  const handleUpdateMedication = (
    id: string,
    updatedMedication: Partial<Medication>
  ) => {
    setMedications((prev) =>
      prev.map((medication) =>
        medication.id === id
          ? { ...medication, ...updatedMedication }
          : medication
      )
    );
  };

  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((medication) => medication.id !== id));
  };

  const handleMarkTaken = (medicationId: string) => {
    const now = new Date();
    handleUpdateMedication(medicationId, {
      lastTaken: now.toISOString(),
    });
  };

  const handleAnalyzeSymptoms = async () => {
    if (!apiKey) {
      setAnalysisError(
        "API key is missing. Please set VITE_OPENROUTER_API_KEY in your .env file."
      );
      return;
    }

    if (patientData.symptoms.length === 0) {
      setAnalysisError("Please add at least one symptom before analyzing.");
      return;
    }

    if (!patientData.age || !patientData.gender) {
      setAnalysisError(
        "Please provide your age and gender for accurate analysis."
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError("");

    try {
      // Pass all relevant fields for enhanced analysis
      const fullPatientData = {
        ...patientData,
        medicalHistory,
        medications,
      };
      console.log("🔍 Sending full patient data:", fullPatientData);
      const result = await analyzeSymptoms(fullPatientData);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(
        "Failed to analyze symptoms. Please check your API key and internet connection.\n" +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    if (activeTab === "symptoms") {
      setPatientData({
        age: 0,
        gender: "",
        symptoms: [],
      });
      setAnalysisResult(null);
      setAnalysisError("");
      localStorage.removeItem("medicalSymptomChecker");
    } else if (activeTab === "history") {
      setMedicalHistory([]);
      localStorage.removeItem("medicalHistory");
    } else if (activeTab === "medications") {
      setMedications([]);
      localStorage.removeItem("medications");
    }
  };

  const selectedSymptomIds = patientData.symptoms
    .map((s) => {
      const template = symptomDatabase.find(
        (t) => t.name.toLowerCase() === s.description.toLowerCase()
      );
      return template?.id || "";
    })
    .filter(Boolean);

  const getSymptomStats = () => {
    const total = patientData.symptoms.length;
    const severe = patientData.symptoms.filter((s) => s.severity >= 7).length;
    const moderate = patientData.symptoms.filter(
      (s) => s.severity >= 4 && s.severity < 7
    ).length;
    const mild = patientData.symptoms.filter((s) => s.severity < 4).length;

    return { total, severe, moderate, mild };
  };

  const getMedicationStats = () => {
    const total = medications.length;
    const active = medications.filter((m) => m.isActive).length;
    const withReminders = medications.filter((m) => m.reminderEnabled).length;

    return { total, active, withReminders };
  };

  const stats = getSymptomStats();
  const medicationStats = getMedicationStats();

  const renderTabContent = () => {
    if (activeTab === "history") {
      return (
        <MedicalHistoryManager
          medicalHistory={medicalHistory}
          onAddHistory={handleAddHistory}
          onUpdateHistory={handleUpdateHistory}
          onRemoveHistory={handleRemoveHistory}
        />
      );
    }

    if (activeTab === "medications") {
      return (
        <MedicationManager
          medications={medications}
          onAddMedication={handleAddMedication}
          onUpdateMedication={handleUpdateMedication}
          onRemoveMedication={handleRemoveMedication}
          onMarkTaken={handleMarkTaken}
        />
      );
    }

    return (
      <>
        {/* Patient Information Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Patient Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Age *
              </label>
              <input
                type="number"
                id="age"
                min="0"
                max="150"
                value={patientData.age || ""}
                onChange={(e) =>
                  updatePatientInfo("age", parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your age"
                required
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gender *
              </label>
              <select
                id="gender"
                value={patientData.gender}
                onChange={(e) => updatePatientInfo("gender", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Summary for Analysis */}
        {(medicalHistory.length > 0 || medications.length > 0) && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">
                Additional Medical Data for AI Analysis
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {medicalHistory.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Medical History
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    {medicalHistory.slice(0, 3).map((history) => (
                      <li key={history.id} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        {history.condition} ({history.diagnosisDate})
                      </li>
                    ))}
                    {medicalHistory.length > 3 && (
                      <li className="text-gray-500 italic">
                        +{medicalHistory.length - 3} more conditions
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {medications.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Current Medications
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    {medications
                      .filter((m) => m.isActive)
                      .slice(0, 3)
                      .map((med) => (
                        <li key={med.id} className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {med.name} - {med.dosage}
                        </li>
                      ))}
                    {medications.filter((m) => m.isActive).length > 3 && (
                      <li className="text-gray-500 italic">
                        +{medications.filter((m) => m.isActive).length - 3} more
                        medications
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <p className="text-blue-700 text-xs mt-3">
              This information will be included in the AI analysis for more
              accurate results.
            </p>
          </div>
        )}

        {/* Symptoms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Symptoms</h2>
              {stats.total > 0 && (
                <div className="ml-4 flex items-center space-x-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    Total: {stats.total}
                  </span>
                  {stats.severe > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      Severe: {stats.severe}
                    </span>
                  )}
                  {stats.moderate > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      Moderate: {stats.moderate}
                    </span>
                  )}
                  {stats.mild > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Mild: {stats.mild}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={addCustomSymptom}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Custom Symptom
            </button>
          </div>

          {/* Symptom Database Selector */}
          <div className="mb-6">
            <SymptomSelector
              onSymptomSelect={addSymptomFromDatabase}
              selectedSymptomIds={selectedSymptomIds}
            />
          </div>

          {patientData.symptoms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No symptoms added yet.</p>
              <p className="text-sm mt-1">
                Browse the symptom database above or add a custom symptom.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {patientData.symptoms.map((symptom, index) => (
                <SymptomCard
                  key={symptom.id}
                  symptom={symptom}
                  index={index}
                  onUpdate={updateSymptom}
                  onRemove={removeSymptom}
                  commonLocations={getCommonLocations(symptom.description)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            AI Analysis
          </h2>

          {analysisError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-700 font-semibold">
                {analysisError}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleAnalyzeSymptoms}
              disabled={
                isAnalyzing || !apiKey || patientData.symptoms.length === 0
              }
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Activity className="h-5 w-5 mr-2" />
                  Analyze with AI
                </>
              )}
            </button>

            <button
              onClick={resetForm}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Form
            </button>
          </div>

          {analysisResult && <AnalysisResults result={analysisResult} />}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Medical Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Comprehensive health tracking with AI-powered symptom analysis
          </p>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> This tool provides AI-generated
              insights for informational purposes only and does not replace
              professional medical advice.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("symptoms")}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "symptoms"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Activity className="h-5 w-5 mr-2" />
              Symptom Checker
              {stats.total > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {stats.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Medical History
              {medicalHistory.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {medicalHistory.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("medications")}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "medications"
                  ? "bg-green-50 text-green-700 border-b-2 border-green-500"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Pill className="h-5 w-5 mr-2" />
              Medications
              {medicationStats.total > 0 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {medicationStats.active}/{medicationStats.total}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Reset Button for active tab */}
        {(activeTab === "history" || activeTab === "medications") && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === "history" ? "Medical History" : "Medication"}{" "}
                Management
              </h3>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All {activeTab === "history" ? "History" : "Medications"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Always consult with a qualified healthcare professional for medical
            advice.
          </p>
          <p className="mt-1">
            This tool uses DeepSeek R1 via OpenRouter for symptom analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
