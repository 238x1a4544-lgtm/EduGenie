import { createServerFn } from "@tanstack/react-start";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

function handleGatewayError(err: unknown): never {
  const anyErr = err as { statusCode?: number; message?: string };
  if (anyErr?.statusCode === 429)
    throw new Error("Rate limit reached. Please wait a moment and try again.");
  if (anyErr?.statusCode === 402)
    throw new Error("AI credits exhausted. Please add credits in your workspace settings.");
  throw new Error(anyErr?.message || "Something went wrong contacting the AI.");
}

export const askQuestion = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ question: z.string().min(2).max(2000) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getGateway()(MODEL),
        system:
          "You are EduGenie, a friendly educational assistant. Answer clearly and accurately. Give the direct answer first, then a short paragraph of helpful educational context. Use plain prose, no markdown headers.",
        prompt: data.question,
      });
      return { answer: text };
    } catch (e) {
      handleGatewayError(e);
    }
  });

export const explainConcept = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        concept: z.string().min(2).max(500),
        level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getGateway()(MODEL),
        system:
          "You are EduGenie. Explain concepts simply with analogies and everyday examples. Adapt depth to the requested level. Keep responses under 250 words.",
        prompt: `Explain "${data.concept}" for a ${data.level} learner. Include a real-world analogy and one worked example.`,
      });
      return { explanation: text };
    } catch (e) {
      handleGatewayError(e);
    }
  });

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        topic: z.string().min(2).max(200),
        count: z.number().int().min(3).max(10).default(5),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { object } = await generateObject({
        model: getGateway()(MODEL),
        schema: z.object({
          questions: z
            .array(
              z.object({
                question: z.string(),
                options: z.array(z.string()).length(4),
                correctIndex: z.number().int().min(0).max(3),
                explanation: z.string(),
              }),
            )
            .min(3)
            .max(10),
        }),
        system:
          "You are EduGenie, an expert quiz author. Create clear, unambiguous multiple-choice questions with exactly 4 options each. correctIndex is 0-based.",
        prompt: `Generate ${data.count} multiple-choice questions about: ${data.topic}. Include a concise explanation for each answer.`,
      });
      return object;
    } catch (e) {
      handleGatewayError(e);
    }
  });

export const summarizeText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ text: z.string().min(20).max(20000) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { object } = await generateObject({
        model: getGateway()(MODEL),
        schema: z.object({
          summary: z.string(),
          keyPoints: z.array(z.string()).min(3).max(8),
        }),
        system:
          "You are EduGenie. Summarize educational text into a concise paragraph followed by key bullet points that a student could revise from.",
        prompt: data.text,
      });
      return object;
    } catch (e) {
      handleGatewayError(e);
    }
  });

export const generateRoadmap = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ topic: z.string().min(2).max(200) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { object } = await generateObject({
        model: getGateway()(MODEL),
        schema: z.object({
          topic: z.string(),
          stages: z
            .array(
              z.object({
                level: z.enum(["Beginner", "Intermediate", "Advanced"]),
                title: z.string(),
                durationWeeks: z.number().int().min(1).max(52),
                topics: z.array(z.string()).min(3).max(8),
                resources: z.array(z.string()).min(2).max(6),
                milestone: z.string(),
              }),
            )
            .length(3),
        }),
        system:
          "You are EduGenie, a personalized learning coach. Build practical roadmaps with concrete topics, resource types (books, docs, courses, projects), and measurable milestones.",
        prompt: `Create a 3-stage personalized learning roadmap (Beginner, Intermediate, Advanced) for: ${data.topic}.`,
      });
      return object;
    } catch (e) {
      handleGatewayError(e);
    }
  });
