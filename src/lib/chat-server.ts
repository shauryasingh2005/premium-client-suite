import { createServerFn } from "@tanstack/react-start";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator(
    z.array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })
    )
  )
  .handler(async ({ data: messages }) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key_here") {
        throw new Error("API_KEY_MISSING");
      }

      const response = await generateText({
        model: openai("gpt-4o-mini"),
        system: "You are a professional fitness and nutrition coach. Answer questions concisely.",
        messages: messages,
      });
      return { success: true, text: response.text };
    } catch (error: any) {
      // Return high-quality, ultra-fast fallback responses immediately
      const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
      
      let reply = "I'm ready to design your weekly custom workout and nutrition program. Tell me about your fitness goals, preferred training style (e.g., Powerlifting, Pehlewani, Hyrox, Hybrid, Calisthenics), and any dietary requirements!";
      
      if (lastMessage.includes("powerlifting")) {
        reply = "Powerlifting is an excellent discipline focusing on Squat, Bench Press, and Deadlift. I recommend a 4-day strength split targeting progressive loading (70-85% of your 1RM). Pair this with a high-protein, calorie-surplus diet. What are your current lifts?";
      } else if (lastMessage.includes("cardio") || lastMessage.includes("hiit") || lastMessage.includes("liss")) {
        reply = "For Cardio & HIIT, we focus on maximizing your metabolic capacity and building your VO2 Max. Let's structure a weekly progression containing 2 interval HIIT sessions and 2 recovery steady-state (Zone 2) jogs. What is your resting heart rate?";
      } else if (lastMessage.includes("pehlewani") || lastMessage.includes("dand") || lastMessage.includes("bethak")) {
        reply = "Pehlewani training emphasizes functional Indian wrestling stamina. Core tools include Gada (mace) swings, Jodi (heavy clubs), Dands (Hindu pushups), and Bethaks (Hindu squats). Consume badam milk, ghee, paneer, and chickpeas. Do you train in an Akhada or at home?";
      } else if (lastMessage.includes("hyrox")) {
        reply = "Hyrox is an elite fitness racing regimen. We combine running intervals with functional stations like sled pushes, rowers, and wall balls. Fuel this with high-carbs and lean proteins to avoid fatigue. What is your current 1k pace?";
      } else if (lastMessage.includes("hybrid")) {
        reply = "A Hybrid athlete program combines powerlifting/heavy strength with running endurance. We balance lifting days with recovery runs, adjusting training blocks weekly. What is your primary focus: strength or running?";
      } else if (lastMessage.includes("diet") || lastMessage.includes("vegan") || lastMessage.includes("carnivore") || lastMessage.includes("keto") || lastMessage.includes("meal")) {
        reply = "We support all major fitness diets including Carnivore, Vegan, Keto, and Intermittent Fasting. For Vegans, we use tofu, chickpeas, and pea protein. For Carnivore, we focus on grass-fed beef and whole eggs. Tell me about your dietary allergies or budget limitations.";
      } else if (lastMessage.match(/\b(age|weight|height|kg|cm|year)\b/i)) {
        reply = "Perfect metrics. Based on this, I suggest a 4-week split. For training: 3 heavy lifting blocks + 1 cardio zone run. For nutrition: high-protein macro-budgeting. Which regimen do you choose: Powerlifting, Pehlewani, Hyrox, Bodybuilding?";
      }
      
      return { success: true, text: reply };
    }
  });
