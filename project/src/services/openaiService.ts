import { PatientData, AnalysisResult } from "../types";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const analyzeSymptoms = async (
  patientData: PatientData
): Promise<AnalysisResult> => {
  try {
    const prompt = createMedicalPrompt(patientData);

    // const response = await fetch(API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${API_KEY}`,
    //     "HTTP-Referer": "http://localhost:5173", // or your deployed domain
    //     "User-Agent": "ai-symptom-checker (http://localhost:5173)",
    //   },
    //   body: JSON.stringify({
    //     model: "deepseek/deepseek-r1-0528:free", // or openai/gpt-4
    //     messages: [
    //       {
    //         role: "system",
    //         content: "You are a medical AI assistant...",
    //       },
    //       {
    //         role: "user",
    //         content: prompt,
    //       },
    //     ],
    //     temperature: 0.3,
    //     max_tokens: 1000,
    //   }),
    // });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free", // or openai/gpt-4
          messages: [
            {
              role: "system",
              content: "You are a medical AI assistant...",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      }
    );

    // const rawText = response.text();
    // console.log("Raw OpenRouter response:", rawText);
    // var result = JSON.parse(rawText);

    // if (!response.ok) {
    //   throw new Error(
    //     `OpenRouter API Error: ${response.status} ${response.statusText}`
    //   );
    // }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;

    if (!content) throw new Error("No response from DeepSeek");

    const parsedResponse = JSON.parse(content);

    if (
      !parsedResponse.type ||
      !parsedResponse.message ||
      !parsedResponse.recommendations
    ) {
      throw new Error("Invalid response structure from DeepSeek");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing symptoms with DeepSeek:", error);

    return {
      type: "monitor",
      message:
        "Unable to complete analysis at this time. Please consult with a healthcare professional for proper evaluation.",
      recommendations: [
        "Contact your healthcare provider for proper evaluation",
        "Monitor your symptoms closely",
        "Seek immediate medical attention if symptoms worsen",
        "Keep a detailed record of your symptoms",
      ],
      urgencyLevel: "medium",
      disclaimer:
        "This analysis could not be completed. Please consult a healthcare professional.",
    };
  }
};


const createMedicalPrompt = (patientData: PatientData): string => {
  const symptomsText = patientData.symptoms
    .map(
      (symptom) =>
        `- ${symptom.description} (Severity: ${symptom.severity}/10, Duration: ${symptom.durationHours} hours, Location: ${symptom.location})`
    )
    .join("\n");

  return `
Please analyze the following patient symptoms and provide a medical assessment.

Patient Information:
- Age: ${patientData.age}
- Gender: ${patientData.gender}

Symptoms:
${symptomsText}

Please respond with ONLY a JSON object in this exact format:
{
  "type": "urgent" | "monitor" | "routine",
  "message": "Brief assessment message",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"],
  "possibleConditions": ["condition 1", "condition 2", "condition 3"],
  "urgencyLevel": "low" | "medium" | "high",
  "disclaimer": "This analysis is for informational purposes only and does not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment."
}
`;
};
