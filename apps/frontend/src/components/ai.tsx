import type { ReactNode } from 'react';

import { Badge } from '@/components/shadcn-ui/badge';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Textarea } from '@/components/shadcn-ui/textarea';
import type { AIMessageState } from '@/zustand/sessions';
import { sessionsStore } from '@/zustand/sessions';

export function AIMessageUI({
  index,
  threadId,
  message,
}: {
  index: number;
  threadId: string;
  message: AIMessageState;
}): ReactNode {
  const handleTextChange = (contentIndex: number, value: string): void => {
    const content = message.content[contentIndex];
    ASSERT(content?.type === 'text');
    const updatedMessage: AIMessageState = {
      ...message,
      content: [
        ...message.content.slice(0, contentIndex),
        {
          ...content,
          text: value,
        },
        ...message.content.slice(contentIndex + 1),
      ],
    };
    sessionsStore.set('updateState', index, threadId, updatedMessage);
  };

  const renderContent = (contentIndex: number): ReactNode => {
    const content = message.content[contentIndex];
    ASSERT(content);

    switch (content.type) {
      case 'thinking': {
        return (
          <div className="space-y-3">
            <div className="text-xs text-blue-500">Thinking:</div>
            <div className={'rounded-lg bg-slate-100 p-4 font-mono text-sm whitespace-pre-wrap dark:bg-slate-800'}>
              {content.thinking}
            </div>
          </div>
        );
      }
      case 'text': {
        return (
          <Textarea
            value={content.text}
            onChange={e => handleTextChange(contentIndex, e.target.value)}
            className="min-h-[80px] resize-none"
            placeholder="AI response..."
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <Card className="mb-2 shadow-md">
      <CardContent className="p-3">
        <div className="mt-2 flex shrink-0 items-center gap-3">
          <Badge variant="default" className="bg-indigo-600 text-xs">
            AI
          </Badge>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>In: {message.inputTokens}</span>
            <span>Out: {message.outputTokens}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          {message.content.map(
            (_, contentIndex): ReactNode => (
              <div key={contentIndex} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">{renderContent(contentIndex)}</div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
