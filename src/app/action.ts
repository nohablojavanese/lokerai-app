"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export async function rewriteSummary(summary: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
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
