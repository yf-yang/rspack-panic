import type { ToolCall } from '@langchain/core/messages/tool';
import type { WritableDraft } from 'immer';
import { createStore } from 'zustand-x';

import { MODELS } from '@/models';

export interface ToolDefinition {
  name: string;
  description: string;
  schema: string;
}

export interface SystemMessageState {
  type: 'system';
  content: string;
}

export interface HumanMessageState {
  type: 'human';
  content: string;
}

export interface ThinkingContent {
  type: 'thinking';
  thinking: string;
  signature: string;
}

export interface TextContent {
  type: 'text';
  text: string;
}

export interface AIMessageState {
  type: 'ai';
  content: (ThinkingContent | TextContent)[];
  inputTokens: number;
  outputTokens: number;
  toolCalls: ToolCall[];
}

export interface ToolMessageState {
  type: 'tool';
  toolCallId: string;
  name: string;
  args: Record<string, unknown>;
  content: string;
}

export interface ModelChoiceState {
  type: 'model-choice';
  current?: string;
  chosen?: string;
}

export type ThreadMessageState =
  | SystemMessageState
  | HumanMessageState
  | AIMessageState
  | ToolMessageState
  | ModelChoiceState;

export interface Thread {
  id: string;
  name: string;
  tools: string[];
  messages: ThreadMessageState[];
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  isPending: boolean;
}

export interface DebugLLMState {
  threads: Thread[];
  activeThreadId: string | null;
  toolDefinitions: ToolDefinition[];
}

export const sessionsStore = createStore(
  {
    threads: [],
    activeThreadId: null,
    toolDefinitions: [],
  } satisfies DebugLLMState as DebugLLMState,
  {
    name: 'debug-llm',
    immer: {
      enabled: true,
    },
    devtools: {
      enabled: true,
    },
    persist: {
      enabled: true,
    },
  }
)
  .extendSelectors(({ get }) => ({
    activeThread: () => {
      return get('threads').find(t => t.id === get('activeThreadId'));
    },
    stateAt: (index: number, threadId: string) => {
      return get('threads').find(t => t.id === threadId)?.messages[index];
    },
  }))
  .extendActions(({ get, set }) => ({
    // Thread management
    createThread: () => {
      const newThread: Thread = {
        id: crypto.randomUUID(),
        name: new Date().toISOString(),
        messages: [
          {
            type: 'system',
            content: 'You are a helpful assistant.',
          } satisfies SystemMessageState,
          {
            type: 'human',
            content: 'Hello, how are you?',
          } satisfies HumanMessageState,
          {
            type: 'model-choice',
            chosen: Object.keys(MODELS)[0],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPending: false,
        tools: [],
      };

      set('state', draft => {
        draft.threads?.push(newThread);
        draft.activeThreadId = newThread.id;
      });
      return newThread.id;
    },

    updateThread: (threadId: string, update: (draft: WritableDraft<Thread>) => void) => {
      set('state', draft => {
        const thread = ASSERT_EXPRESSION(draft.threads?.find(t => t.id === threadId));
        update(thread);
      });
    },

    deleteThread: (threadId: string) => {
      set('state', draft => {
        if (draft.threads) {
          draft.threads = draft.threads.filter(t => t.id !== threadId);

          // If we deleted the active thread, switch to the first available thread
          if (draft.activeThreadId === threadId) {
            draft.activeThreadId = draft.threads.length > 0 ? draft.threads[0].id : null;
          }
        }
      });
    },

    setActiveThread: (threadId: string) => {
      set('state', draft => {
        draft.activeThreadId = threadId;
      });
    },

    updateState: (index: number, threadId: string, state: ThreadMessageState) => {
      set('state', draft => {
        const thread = ASSERT_EXPRESSION(draft.threads?.find(t => t.id === threadId));
        thread.messages[index] = state;
        thread.updatedAt = new Date();
      });
    },

    removeStatesAfter: (index: number, threadId: string) => {
      set('state', draft => {
        if (draft.threads) {
          const thread = ASSERT_EXPRESSION(draft.threads.find(t => t.id === threadId));
          thread.messages.splice(index + 1);
          thread.updatedAt = new Date();
        }
      });
    },

    updateToolDefinitions: (toolDefinitions: ToolDefinition[]) => {
      set('state', draft => {
        draft.toolDefinitions = toolDefinitions;
      });
    },

    // Tool definition management
    addToolDefinition: (toolDefinition: ToolDefinition) => {
      set('state', draft => {
        if (!draft.toolDefinitions.some(tool => tool.name === toolDefinition.name)) {
          draft.toolDefinitions.push(toolDefinition);
        }
      });
    },

    updateToolDefinition: (index: number, toolDefinition: ToolDefinition) => {
      set('state', draft => {
        if (draft.toolDefinitions[index]) {
          draft.toolDefinitions[index] = toolDefinition;
        }
      });
    },

    deleteToolDefinition: (index: number) => {
      set('state', draft => {
        if (draft.toolDefinitions[index]) {
          const toolName = draft.toolDefinitions[index].name;
          draft.toolDefinitions.splice(index, 1);
          // Remove this tool from all threads
          for (const thread of draft.threads) {
            thread.tools = thread.tools.filter(tool => tool !== toolName);
          }
        }
      });
    },

    // Thread tool management
    addToolToThread: (threadId: string, toolName: string) => {
      set('state', draft => {
        const thread = draft.threads?.find(t => t.id === threadId);
        if (thread && !thread.tools.includes(toolName)) {
          thread.tools.push(toolName);
          thread.updatedAt = new Date();
        }
      });
    },

    removeToolFromThread: (threadId: string, toolName: string) => {
      set('state', draft => {
        const thread = draft.threads?.find(t => t.id === threadId);
        if (thread) {
          thread.tools = thread.tools.filter(tool => tool !== toolName);
          thread.updatedAt = new Date();
        }
      });
    },

    // Export/Import functionality
    exportThread: (threadId: string): string => {
      const thread = get('threads').find(t => t.id === threadId);
      if (!thread) {
        throw new Error('Thread not found');
      }
      
      const exportData = {
        name: thread.name,
        tools: thread.tools,
        messages: thread.messages,
        error: thread.error,
      };
      
      return JSON.stringify(exportData, null, 2);
    },

    importThread: (threadData: string): string => {
      try {
        const parsedData = JSON.parse(threadData);
        
        const newThread: Thread = {
          id: crypto.randomUUID(),
          name: parsedData.name || 'Imported Thread',
          tools: parsedData.tools || [],
          messages: parsedData.messages || [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPending: false,
          error: parsedData.error,
        };

        set('state', draft => {
          draft.threads?.push(newThread);
          draft.activeThreadId = newThread.id;
        });
        
        return newThread.id;
      } catch (error) {
        throw new Error('Invalid thread data format');
      }
    },


    exportToolDefinitions: (): string => {
      const toolDefinitions = get('toolDefinitions');
      return JSON.stringify(toolDefinitions, null, 2);
    },

    importToolDefinitions: (toolsData: string): void => {
      try {
        const parsedData = JSON.parse(toolsData);
        
        if (!Array.isArray(parsedData)) {
          throw new Error('Data must be an array of tool definitions');
        }
        
        set('state', draft => {
          parsedData.forEach(toolData => {
            if (toolData.name && toolData.description && toolData.schema) {
              if (!draft.toolDefinitions.some(tool => tool.name === toolData.name)) {
                draft.toolDefinitions.push({
                  name: toolData.name,
                  description: toolData.description,
                  schema: toolData.schema,
                });
              }
            }
          });
        });
      } catch (error) {
        throw new Error('Invalid tool definitions data format');
      }
    },
  }));
