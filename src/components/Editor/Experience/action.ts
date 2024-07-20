"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export async function rewriteSummary(summary: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
           `
            You are a professional CV writer. Rewrite the given summary 
            in a more professional and concise manner. The summary should 
            follow ATS (Applicant tracking system) standard, pick perfect 
            language. You become the subject "I" in this summary!
            
            
            
            Match user summary language unless they ask 
            specifically in English.
          `,
          },
        { role: "user", content: summary },
      ],
      maxTokens: 200,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}


export async function JobDescAI(summary: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
           `
            You are a professional CV writer. Translate the input into English Sentance and add use
            ATS Friendly words. return as point format (-)

            
          `,
          },
        { role: "user", content: summary },
      ],
      maxTokens: 200,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
