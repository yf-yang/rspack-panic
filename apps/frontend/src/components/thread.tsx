import type { ReactNode } from 'react';
import { useStoreValue } from 'zustand-x';

import { Badge } from '@/components/shadcn-ui/badge';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { sessionsStore } from '@/zustand/sessions';

import { ErrorBoundary } from './error-boundary';
import { Message } from './message';
import { ThreadList } from './thread-list';
import { ToolSelectionUI } from './tool-selection';

export function ThreadUI(): ReactNode {
  const thread = useStoreValue(sessionsStore, 'activeThread');

  return (
    <div className="flex h-screen">
      <ErrorBoundary>
        <ThreadList />
      </ErrorBoundary>

      <div className="flex-1 overflow-auto">
        {thread ? (
          <ErrorBoundary>
            <div className="mx-auto max-w-4xl p-1">
              <div className="mb-2">
                <h1 className="mb-1 text-base font-bold">{thread.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={thread.isPending ? 'default' : 'secondary'}>
                    {thread.isPending ? 'Pending' : 'Complete'}
                  </Badge>
                  {thread.error !== undefined && <Badge variant="destructive">Error</Badge>}
                </div>
              </div>

              <ErrorBoundary>
                <ToolSelectionUI threadId={thread.id} />
              </ErrorBoundary>

              <div className="space-y-0">
                <h2 className="mb-1 text-sm font-semibold">Messages</h2>
                {thread.messages.map((_, index) => (
                  <ErrorBoundary key={index}>
                    <Message index={index} threadId={thread.id} />
                  </ErrorBoundary>
                ))}
              </div>

              {thread.error !== undefined && (
                <Card className="mt-2 border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-red-600">{thread.error}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ErrorBoundary>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-muted-foreground">No thread selected</h2>
              <p className="text-sm text-muted-foreground">
                Select a thread from the sidebar to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
