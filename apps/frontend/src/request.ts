import type { ToolDefinition } from '@langchain/core/language_models/base';
import type { MessageContentComplex } from '@langchain/core/messages';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import JSON5 from 'json5';

import type { ModelChoiceState, TextContent, ThinkingContent } from '@/zustand/sessions';
import { sessionsStore } from '@/zustand/sessions';

import { MODELS } from './models';

const logger = MAKE_LOGGER('request');

export async function requestModel(threadId: string, messageIndex: number): Promise<void> {
  sessionsStore.set('updateThread', threadId, draft => {
    draft.isPending = true;
    draft.error = undefined;
  });

  const thread = sessionsStore.get('threads').find(t => t.id === threadId);
  ASSERT(thread);

  const modelChoice = thread.messages.at(messageIndex);
  ASSERT(modelChoice?.type === 'model-choice');
  ASSERT(modelChoice.chosen !== undefined);

  let response: AIMessage | undefined;
  try {
    ASSERT(Object.prototype.hasOwnProperty.call(MODELS, modelChoice.chosen));
    const buildModel = MODELS[modelChoice.chosen as keyof typeof MODELS];
    sessionsStore.set('updateState', messageIndex, threadId, {
      ...modelChoice,
      current: modelChoice.chosen,
    } as ModelChoiceState);

    const toolDefinitions = sessionsStore.get('toolDefinitions');

    sessionsStore.set('removeStatesAfter', messageIndex, threadId);

    const tools = thread.tools
      .map(tool => {
        const toolDefinition = toolDefinitions.find(td => td.name === tool);
        if (!toolDefinition) {
          return undefined;
        }
        return {
          type: 'function',
          function: {
            ...toolDefinition,
            parameters: JSON5.parse(toolDefinition.schema),
          },
        } satisfies ToolDefinition as ToolDefinition;
      })
      .filter((t): t is ToolDefinition => t !== undefined);

    const model = buildModel().bindTools(tools);

    const messages = thread.messages
      .slice(0, messageIndex)
      .map(message => {
        switch (message.type) {
          case 'system': {
            return new SystemMessage(message.content);
          }
          case 'human': {
            return new HumanMessage(message.content);
          }
          case 'ai': {
            return new AIMessage({
              content: message.content as MessageContentComplex[],
              // eslint-disable-next-line @typescript-eslint/naming-convention -- That's langchain's API
              tool_calls: message.toolCalls,
            });
          }
          case 'tool': {
            return new ToolMessage({
              content: message.content,
              // eslint-disable-next-line @typescript-eslint/naming-convention -- That's langchain's API
              tool_call_id: message.toolCallId,
            });
          }
          case 'model-choice': {
            return null;
          }
          default: {
            return UNREACHABLE(message);
          }
        }
      })
      .filter((m): m is SystemMessage | HumanMessage | AIMessage | ToolMessage => m !== null);

    DEBUG(logger, 'messages %o', messages);
    response = (await model.invoke(messages)) as AIMessage;
    DEBUG(logger, 'response %o', response);
  } catch (error) {
    sessionsStore.set('updateThread', threadId, draft => {
      draft.error = error instanceof Error ? error.message : 'An unknown error occurred';
    });
  } finally {
    sessionsStore.set('updateThread', threadId, draft => {
      draft.isPending = false;
    });
  }

  if (response === undefined) {
    return;
  }

  const content =
    typeof response.content === 'string'
      ? [{ type: 'text', text: response.content }]
      : response.content;

  sessionsStore.set('updateThread', threadId, draft => {
    ASSERT(response);
    draft.isPending = false;
    draft.messages.push({
      type: 'ai',
      content: content as (ThinkingContent | TextContent)[],
      inputTokens: response.usage_metadata?.input_tokens ?? 0,
      outputTokens: response.usage_metadata?.output_tokens ?? 0,
      toolCalls: response.tool_calls ?? [],
    });
    if (response.tool_calls !== undefined && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        draft.messages.push({
          type: 'tool',
          name: toolCall.name,
          args: toolCall.args,
          toolCallId: ASSERT_EXPRESSION(toolCall.id),
          content: '',
        });
      }
    } else {
      draft.messages.push({
        type: 'human',
        content: '',
      });
    }
    draft.messages.push({
      type: 'model-choice',
      chosen: modelChoice.chosen,
    });
  });
}
