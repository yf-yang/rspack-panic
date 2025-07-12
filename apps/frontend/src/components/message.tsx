import type { ReactNode } from 'react';
import { useStoreValue } from 'zustand-x';

import { sessionsStore } from '@/zustand/sessions';

import { AIMessageUI } from './ai';
import { HumanMessageUI } from './human';
import { ModelChoiceUI } from './model-choice';
import { SystemMessageUI } from './system';
import { ToolMessageUI } from './tool';

export function Message({ index, threadId }: { index: number; threadId: string }): ReactNode {
  const message = useStoreValue(sessionsStore, 'stateAt', index, threadId);
  ASSERT(message);
  switch (message.type) {
    case 'system': {
      return <SystemMessageUI index={index} threadId={threadId} message={message} />;
    }
    case 'human': {
      return <HumanMessageUI index={index} threadId={threadId} message={message} />;
    }
    case 'ai': {
      return <AIMessageUI index={index} threadId={threadId} message={message} />;
    }
    case 'tool': {
      return <ToolMessageUI index={index} threadId={threadId} message={message} />;
    }
    case 'model-choice': {
      return <ModelChoiceUI index={index} threadId={threadId} message={message} />;
    }
    default: {
      UNREACHABLE(message);
    }
  }
}
