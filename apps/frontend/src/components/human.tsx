import type { ReactNode } from 'react';
import { useStoreValue } from 'zustand-x';

import { Badge } from '@/components/shadcn-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Textarea } from '@/components/shadcn-ui/textarea';
import type { HumanMessageState } from '@/zustand/sessions';
import { sessionsStore } from '@/zustand/sessions';

export function HumanMessageUI({
  index,
  threadId,
  message,
}: {
  index: number;
  threadId: string;
  message: HumanMessageState;
}): ReactNode {
  const thread = useStoreValue(sessionsStore, 'threads').find(t => t.id === threadId);
  const isPending = thread?.isPending ?? false;

  return (
    <Card className="mb-1">
      <CardContent className="p-2">
        <div className="flex items-start gap-2">
          <Badge variant="default" className="text-xs bg-green-500 shrink-0 mt-1">Human</Badge>
          <Textarea
            value={message.content}
            onChange={e => {
              sessionsStore.set('updateState', index, threadId, {
                ...message,
                content: e.target.value,
              } satisfies HumanMessageState);
            }}
            placeholder="Enter your message..."
            disabled={isPending}
            className="min-h-[60px] resize-none flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
