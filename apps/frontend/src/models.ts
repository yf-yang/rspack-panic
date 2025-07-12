/* eslint-disable @typescript-eslint/naming-convention -- For LLM models */
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';

export const MODELS = {
  'claude-3-7-sonnet-latest': () =>
    new ChatAnthropic({
      model: 'claude-3-7-sonnet-latest',
      thinking: { type: 'enabled', budget_tokens: 2000 },
      maxTokens: 8192,
      apiKey: process.env.ANTHROPIC_API_KEY,
    }),
  'claude-sonnet-4-20250514': () =>
    new ChatAnthropic({
      model: 'claude-sonnet-4-20250514',
      thinking: { type: 'enabled', budget_tokens: 2000 },
      maxTokens: 8192,
      apiKey: process.env.ANTHROPIC_API_KEY,
    }),
  'o4-mini-2025-04-16': () =>
    new ChatOpenAI({
      model: 'o4-mini-2025-04-16',
      maxTokens: 8192,
      apiKey: process.env.OPENAI_API_KEY,
    }),
};
