import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateWorkoutPlan(userGoals: string, fitnessLevel: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a professional fitness coach. Create a detailed workout plan based on the user's goals and fitness level."
      },
      {
        role: "user",
        content: `Create a workout plan for someone with ${fitnessLevel} fitness level who wants to focus on ${userGoals}.`
      }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}