// app/actions.ts
'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export async function rewriteSummary(summary: string) {
  const stream = createStreamableValue('');

  (async () => {
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
  })();

  return { output: stream.value };
}