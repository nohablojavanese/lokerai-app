"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import {
  canMakeRequest,
  updateRequestTime,
  MAX_REQUESTS_PER_HOUR,
} from "@/lib/limit";

export async function rewriteSummary(summary: string) {
  if (!canMakeRequest()) {
    throw new Error(
      `Batas Pemakaian AI kamu sudah Habis! Upgrade ke Paket Senyum untuk Nikmati Kuota Lebih.`
    );
  }

  const stream = createStreamableValue("");
  const { textStream } = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [
      {
        role: "system",
        content:
          "You are a professional CV writer. Rewrite the given summary in a more professional and concise manner. The summary should follow ATS (Applicant tracking system) standard, pick perfect language. Match user summary language unless they ask specifically in English (Mainly for Bahasa Indonesian and English)",
      },
      { role: "user", content: summary },
    ],
  });

  for await (const delta of textStream) {
    stream.update(delta);
  }

  stream.done();

  updateRequestTime();

  return { output: stream.value };
}

export async function generateFullCV(cvData: any) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content:
            "You are a professional CV writer. Generate a full CV based on the provided data.",
        },
        { role: "user", content: JSON.stringify(cvData) },
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
