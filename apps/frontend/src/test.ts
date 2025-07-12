import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';
import 'dotenv/config';

const model = new ChatAnthropic({
  model: 'claude-3-7-sonnet-latest',
  // eslint-disable-next-line @typescript-eslint/naming-convention -- Anthropic API
  thinking: { type: 'enabled', budget_tokens: 2000 },
  maxTokens: 8192,
}).bindTools([
  {
    type: 'function',
    function: {
      name: 'greet',
      description: 'Greet the user',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'The word to greet' },
        },
      },
    },
  },
]);

const response = await model.invoke([new HumanMessage('Hello')]);
console.log(JSON.stringify(response, null, 2));
