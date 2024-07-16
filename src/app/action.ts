'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({ tokensPerInterval: 3, interval: "hour" });

export async function rewriteSummary(summary: string) {
  const stream = createStreamableValue('');

  try {
    const remainingRequests = await limiter.removeTokens(1);
    
    if (remainingRequests < 0) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }

    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        { role: 'system', content: 'You are a professional CV writer. Rewrite the given summary in a more professional and concise manner.' },
        { role: 'user', content: summary }
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  } catch (error) {
    stream.error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }

  return { output: stream.value };
}

// New experimental function that uses Redux store data //
export async function generateFullCV(cvData: any) {
  const stream = createStreamableValue('');

  try {
    const remainingRequests = await limiter.removeTokens(1);
    
    if (remainingRequests < 0) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }

    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        { role: 'system', content: 'You are a professional CV writer. Generate a full CV based on the provided data.' },
        { role: 'user', content: JSON.stringify(cvData) }
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  } catch (error) {
    stream.error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }

  return { output: stream.value };
}