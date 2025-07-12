import type { ReactNode } from 'react';
import { useStoreValue } from 'zustand-x';

import { MODELS } from '@/models';
import { requestModel } from '@/request';
import { sessionsStore, type ModelChoiceState } from '@/zustand/sessions';

import { Badge } from './shadcn-ui/badge';
import { Button } from './shadcn-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './shadcn-ui/card';
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from './shadcn-ui/select';

export function ModelChoiceUI({
  index,
  threadId,
  message,
}: {
  index: number;
  threadId: string;
  message: ModelChoiceState;
}): ReactNode {
  const thread = useStoreValue(sessionsStore, 'threads').find(t => t.id === threadId);
  ASSERT(thread);
  const isPending = thread.isPending;
  const isLastMessage = index === thread.messages.length - 1;

  const handleRequest = (): void => {
    void requestModel(threadId, index);
  };

  const handleResendInNewThread = (): void => {
    const id = crypto.randomUUID();
    sessionsStore.set('threads', [
      ...sessionsStore.get('threads'),
      {
        id,
        name: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPending: false,
        tools: [],
        messages: thread.messages.slice(0, index + 1),
      },
    ]);
    sessionsStore.set('activeThreadId', id);
    void requestModel(id, index);
  };

  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="text-xs">
            Model Choice
          </Badge>
          {message.current !== undefined && (
            <Badge variant="secondary" className="text-xs">
              Current: {message.current}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Select
              value={message.chosen}
              onValueChange={value => {
                sessionsStore.set('updateState', index, threadId, {
                  ...message,
                  chosen: value,
                } satisfies ModelChoiceState);
              }}
              disabled={isPending}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MODELS).map(key => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRequest}
              disabled={message.chosen === undefined || isPending}
              className={'h-8 px-4 text-xs'}
            >
              {isLastMessage ? 'Request' : 'Resend Request'}
            </Button>
            {!isLastMessage && (
              <Button
                onClick={handleResendInNewThread}
                disabled={message.chosen === undefined || isPending}
                variant="outline"
                className={'h-8 px-4 text-xs'}
              >
                Resend in New Thread
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
