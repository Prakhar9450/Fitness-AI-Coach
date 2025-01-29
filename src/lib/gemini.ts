import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateWorkoutPlan(userGoals: string, fitnessLevel: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `As a professional fitness coach, create a detailed workout plan for someone with ${fitnessLevel} fitness level who wants to focus on ${userGoals}. Include specific exercises, sets, and reps.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateWeeklySchedule(trainingType: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `As a professional fitness coach, create a detailed 7-day ${trainingType} training schedule. For each day, include:
  1. Specific exercises with sets and reps
  2. Rest periods
  3. Intensity levels
  4. Estimated duration
  5. Tips for proper form
  6. Recovery recommendations
  Format the response in a clear, day-by-day structure.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function getChatResponse(message: string, chatHistory: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: chatHistory.map(msg => ({ role: msg.startsWith("User: ") ? "user" : "model", parts: msg.substring(msg.indexOf(": ") + 2) })),
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}