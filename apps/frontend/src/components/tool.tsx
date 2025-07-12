import { InfoIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/shadcn-ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Textarea } from '@/components/shadcn-ui/textarea';
import type { ToolMessageState } from '@/zustand/sessions';
import { sessionsStore } from '@/zustand/sessions';

export function ToolMessageUI({
  index,
  threadId,
  message,
}: {
  index: number;
  threadId: string;
  message: ToolMessageState;
}): ReactNode {
  const [content, setContent] = useState(message.content);

  const handleContentChange = (value: string) => {
    setContent(value);
    sessionsStore.set('updateState', index, threadId, {
      ...message,
      content: value,
    } as ToolMessageState);
  };

  const scrollToToolDefinition = () => {
    const toolDefElement = document.querySelector(`#tool-def-${message.name}`);
    if (toolDefElement) {
      toolDefElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="text-xs">
            Tool
          </Badge>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">{message.name}</span>
            <InfoIcon
              className="h-3 w-3 cursor-pointer transition-colors hover:text-blue-500"
              onClick={scrollToToolDefinition}
              title="View tool definition"
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            {message.toolCallId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div>
          <label className="mb-1 block text-xs font-medium">Arguments:</label>
          <div className="rounded-md bg-gray-50 p-2 font-mono text-xs dark:bg-gray-900">
            {JSON.stringify(message.args, null, 2)}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Response:</label>
          <Textarea
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder="input the tool response"
            className="min-h-[60px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
