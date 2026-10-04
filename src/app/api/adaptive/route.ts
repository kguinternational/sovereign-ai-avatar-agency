import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

export async function POST(req: Request) {
  try {
    const { subject, topic, gaps } = await req.json();

    const prompt = `You are an adaptive learning assessment engine for Alpha School.
Generate a single multiple-choice question for a student studying:
Subject: ${subject}
Topic: ${topic}
Identified Gaps: ${gaps.length > 0 ? gaps.join(', ') : 'None'}

Return a JSON object with this exact structure:
{
  "q": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0, // integer index of the correct option
  "gap": "A short 3-5 word description of the knowledge gap this targets if they get it wrong"
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;
    if (!result) throw new Error("No response");

    return NextResponse.json(JSON.parse(result));
  } catch (error) {
    console.error("Adaptive Engine Error:", error);
    // Fallback if API fails
    return NextResponse.json({
      q: "What is 2 + 2? (Fallback Question)",
      options: ["3", "4", "5", "6"],
      correct: 1,
      gap: "Basic addition"
    });
  }
}
