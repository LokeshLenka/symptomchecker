import { PatientData, AnalysisResult, Symptom, MedicalHistory, Medication } from "../types";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const analyzeSymptoms = async (
  patientData: PatientData
): Promise<AnalysisResult> => {
  try {
    // Get API key from environment variable
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "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";
    
    if (!API_KEY) {
      throw new Error("API key is not configured. Please set VITE_OPENROUTER_API_KEY environment variable.");
    }

    const prompt = createEnhancedMedicalPrompt(patientData);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin, // Use dynamic origin
        "User-Agent": "symptom-checker-app",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: `You are an expert medical AI assistant specializing in symptom analysis. 
           
CRITICAL INSTRUCTIONS:
- Respond ONLY with valid JSON - no markdown, no explanations, no extra text
- Be precise and medically accurate
- Focus on the most likely conditions based on symptoms
- Prioritize patient safety in recommendations
- Use clinical reasoning patterns

Response format (JSON only):
{
 "type": "urgent|monitor|routine",
 "message": "concise clinical assessment",
 "recommendations": ["specific actionable advice", "..."],
 "possibleConditions": ["most likely conditions", "..."],
 "urgencyLevel": "low|medium|high",
 "disclaimer": "standard medical disclaimer"
}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stream: false,
      }),
    });

    const raw = await response.text();
    console.log("🔍 Raw response from OpenRouter:", raw);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${raw}`);
    }

    const json = JSON.parse(raw);
    const content = json?.choices?.[0]?.message?.content?.trim();

    if (!content) throw new Error("Empty content from AI");

    // Clean extra formatting like ```json ... ```
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Basic schema check
    if (
      !parsed.type ||
      !parsed.message ||
      !parsed.recommendations ||
      !parsed.disclaimer
    ) {
      throw new Error("AI response missing expected fields");
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error analyzing symptoms:", error);

    return {
      type: "monitor",
      message:
        "Unable to complete analysis at this time. Please consult with a healthcare professional.",
      recommendations: [
        "Contact your doctor if symptoms persist",
        "Monitor your temperature regularly",
        "Stay hydrated",
        "Rest and avoid exertion",
        "Use over-the-counter fever medication if advised",
      ],
      possibleConditions: [],
      urgencyLevel: "medium",
      disclaimer:
        "This analysis is for informational purposes only and does not replace professional medical advice.",
    };
  }
};

// Define EnhancedPatientData locally for this file
interface EnhancedPatientData extends PatientData {
  medicalHistory?: MedicalHistory[];
  medications?: Medication[];
}

const createEnhancedMedicalPrompt = (
  patientData: EnhancedPatientData
): string => {
  const symptomsText = (patientData.symptoms || []).map(
    (symptom: Symptom) =>
      `- ${symptom.description} (Severity: ${symptom.severity}/10, Duration: ${symptom.durationHours} hours, Location: ${symptom.location || 'Not specified'})`
  ).join("\n");

  const medicalHistoryText = (patientData.medicalHistory && patientData.medicalHistory.length > 0)
    ? patientData.medicalHistory.map(
        h => `- ${h.condition} (${h.diagnosisDate || "Unknown"}) | Status: ${h.status || "Unknown"}, Severity: ${h.severity || "Unknown"}${h.treatment ? ", Treatment: " + h.treatment : ""}${h.notes ? ", Notes: " + h.notes : ""}${h.relatedSymptoms && h.relatedSymptoms.length > 0 ? ", Related Symptoms: " + h.relatedSymptoms.join(", ") : ""}`
      ).join("\n")
    : "No significant medical history reported";

  const medicationsText = (patientData.medications && patientData.medications.length > 0)
    ? patientData.medications.map(
        m => `- ${m.name} ${m.dosage} (${m.frequency}) | Times: ${m.times && m.times.length > 0 ? m.times.join(", ") : "N/A"}, Start: ${m.startDate}${m.endDate ? ", End: " + m.endDate : ""}${m.notes ? ", Notes: " + m.notes : ""}, Active: ${m.isActive ? "Yes" : "No"}, Reminder: ${m.reminderEnabled ? "On" : "Off"}${m.lastTaken ? ", Last Taken: " + m.lastTaken : ""}`
      ).join("\n")
    : "No current medications reported";

  return `
Analyze these patient symptoms and provide a medical assessment.

PATIENT DATA:
- Age: ${patientData.age} years
- Gender: ${patientData.gender}

SYMPTOMS:
${symptomsText}

MEDICAL HISTORY:
${medicalHistoryText}

CURRENT MEDICATIONS:
${medicationsText}

ANALYSIS REQUIREMENTS:
- Assess urgency level based on symptom severity and combination
- Provide 3-5 specific, actionable recommendations
- List 2-4 most likely conditions based on symptoms
- Consider patient's age and gender in assessment
- Prioritize patient safety

Respond with ONLY the JSON object as specified in the system prompt.
`;
};
