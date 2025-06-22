import React, { useState, useEffect } from "react";
import { Plus, Activity, User, AlertTriangle } from "lucide-react";
import { Symptom, PatientData, AnalysisResult, SymptomTemplate } from "./types";
import { symptomDatabase } from "./data/symptomDatabase";
import { SymptomSelector } from "./components/SymptomSelector";
import { SymptomCard } from "./components/SymptomCard";
// import { ApiKeySetup } from "./components/ApiKeySetup";
import { AnalysisResults } from "./components/AnalysisResults";
import { analyzeSymptoms } from "./services/aiService";

function App() {
  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: "",
    symptoms: [],
  });

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  // const [apiKey, setApiKey] = useState<string>("");
  const [analysisError, setAnalysisError] = useState<string>("");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("medicalSymptomChecker");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPatientData(parsedData);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }

    // Load API key from localStorage
    // const savedApiKey = localStorage.getItem('openai_api_key');
    //   if (savedApiKey) {
    //     setApiKey(savedApiKey);
    //     // Set environment variable for OpenAI client
    //     import.meta.env.VITE_OPENAI_API_KEY = savedApiKey;
    //   }
  }, []);

  // Save to localStorage whenever patient data changes
  useEffect(() => {
    localStorage.setItem("medicalSymptomChecker", JSON.stringify(patientData));
  }, [patientData]);

  // const handleApiKeySet = (newApiKey: string) => {
  //   if (newApiKey) {
  //     setApiKey(newApiKey);
  //     localStorage.setItem('openai_api_key', newApiKey);
  //     import.meta.env.VITE_OPENAI_API_KEY = newApiKey;
  //   } else {
  //     setApiKey('');
  //     localStorage.removeItem('openai_api_key');
  //     delete import.meta.env.VITE_OPENAI_API_KEY;
  //   }
  // };

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

  const handleAnalyzeSymptoms = async () => {
    if (!apiKey || apiKey.startsWith("sk-") === false) {
      setAnalysisError(
        "API key is missing or invalid. Please set VITE_DEEPSEEK_API_KEY in your .env file."
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
      const result = await analyzeSymptoms(patientData);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(
        "Failed to analyze symptoms. Please check your API key and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setPatientData({
      age: 0,
      gender: "",
      symptoms: [],
    });
    setAnalysisResult(null);
    setAnalysisError("");
    localStorage.removeItem("medicalSymptomChecker");
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

  const stats = getSymptomStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Medical Symptom Checker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Get AI-powered insights about your symptoms using DeepSeek R1
          </p>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> This tool provides AI-generated
              insights for informational purposes only and does not replace
              professional medical advice.
            </p>
          </div>
        </div>

        {/* API Key Setup */}
        {/* <ApiKeySetup onApiKeySet={handleApiKeySet} hasApiKey={!!apiKey} /> */}

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
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{analysisError}</p>
              </div>
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

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Always consult with a qualified healthcare professional for medical
            advice.
          </p>
          <p className="mt-1">
            This tool uses DeepSeek: R1 0528 model for symptom analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
