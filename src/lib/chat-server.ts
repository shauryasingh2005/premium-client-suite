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
      const response = await generateText({
        model: openai("gpt-4o-mini"),
        system: "You are a professional fitness and nutrition coach. Answer questions concisely.",
        messages: messages,
      });
      return { success: true, text: response.text };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
