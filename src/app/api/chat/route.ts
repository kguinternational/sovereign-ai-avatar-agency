import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    
    // Function to generate a mock response
    const generateMockResponse = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const latestMessage = messages[messages.length - 1].content.toLowerCase();
      let responseText = "That's a great thought! Can you explain your reasoning a bit more?";
      
      if (latestMessage.includes("hello") || latestMessage.includes("hi")) {
        responseText = "Hello! I'm your AI Guide. Ready to crush some Algebra II today?";
      } else if (latestMessage.includes("yes") || latestMessage.includes("ready")) {
        responseText = "Awesome! Let's start with a quick review. What is the factored form of x² - 9?";
      } else if (latestMessage.includes("x-3") && latestMessage.includes("x+3")) {
        responseText = "Perfect! (x-3)(x+3) is exactly right. You are showing great mastery. Let's try a harder one: factor x² + 5x + 6.";
      } else if (latestMessage.includes("x+2") && latestMessage.includes("x+3")) {
        responseText = "Spot on! Your mastery score is going up. Keep up the great work!";
      } else if (latestMessage.includes("help") || latestMessage.includes("stuck")) {
        responseText = "No problem! Remember to look for two numbers that multiply to the constant term and add up to the middle term's coefficient. Want a hint for a specific problem?";
      }

      return new Response(JSON.stringify({ content: responseText + "\n\n*(Note: This is a simulated response because the provided Gemini API Key is invalid or unsupported)*" }), {
        headers: { "Content-Type": "application/json" }
      });
    };

    // If no reasonable key is provided at all, just mock.
    if (!apiKey || apiKey.includes("your_gemini") || apiKey.includes("your_key") || apiKey.length < 15) {
      console.log("Using mock AI response since no valid GEMINI_API_KEY is provided.");
      return await generateMockResponse();
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));
      
      const latestMessage = messages[messages.length - 1].content;
      
      const chat = model.startChat({
        history: history,
        systemInstruction: "You are an AI Tutor for the Alpha School 2-Hour Learning program. Your goal is to guide the student to mastery (90%+) in their current subject (e.g. Math, Reading). Do not just give answers. Ask guiding questions, provide hints, and evaluate their understanding. Be encouraging and concise."
      });

      const result = await chat.sendMessage(latestMessage);
      const responseText = result.response.text();

      return new Response(JSON.stringify({ content: responseText }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (apiError: any) {
      console.error("Gemini API call failed (possibly invalid key):", apiError.message);
      return await generateMockResponse();
    }
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat. Check server logs." }), { status: 500 });
  }
}
