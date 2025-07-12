import type { ReactNode } from 'react';
import { useStoreValue } from 'zustand-x';

import { Badge } from '@/components/shadcn-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Textarea } from '@/components/shadcn-ui/textarea';
import type { SystemMessageState } from '@/zustand/sessions';
import { sessionsStore } from '@/zustand/sessions';

export function SystemMessageUI({
  index,
  threadId,
  message,
}: {
  index: number;
  threadId: string;
  message: SystemMessageState;
}): ReactNode {
  const thread = useStoreValue(sessionsStore, 'threads').find(t => t.id === threadId);
  const isPending = thread?.isPending ?? false;

  return (
    <Card className="mb-1">
      <CardContent className="p-2">
        <div className="flex items-start gap-2">
          <Badge variant="default" className="text-xs bg-purple-500 shrink-0 mt-1">System</Badge>
          <Textarea
            value={message.content}
            onChange={e => {
              sessionsStore.set('updateState', index, threadId, {
                ...message,
                content: e.target.value,
              } satisfies SystemMessageState);
            }}
            placeholder="Enter system message..."
            className="min-h-[60px] resize-none flex-1"
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
