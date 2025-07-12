import { cn } from '@udecode/cn';
import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import { LuPlus, LuTrash, LuPencil, LuDownload, LuUpload } from 'react-icons/lu';
import { useStoreValue } from 'zustand-x';

import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { ScrollArea } from '@/components/shadcn-ui/scroll-area';
import { sessionsStore } from '@/zustand/sessions';

export function ThreadList(): ReactNode {
  const threads = useStoreValue(sessionsStore, 'threads');
  const activeThreadId = useStoreValue(sessionsStore, 'activeThreadId');

  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateThread = (): void => {
    sessionsStore.set('createThread');
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    sessionsStore.set('deleteThread', threadId);
  };

  const handleStartEdit = (threadId: string, currentName: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setEditingThreadId(threadId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (threadId: string): void => {
    if (editingName.trim()) {
      sessionsStore.set('updateThread', threadId, draft => {
        draft.name = editingName.trim();
        draft.updatedAt = new Date();
      });
    }
    setEditingThreadId(null);
    setEditingName('');
  };

  const handleCancelEdit = (): void => {
    setEditingThreadId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, threadId: string): void => {
    if (e.key === 'Enter') {
      handleSaveEdit(threadId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleExportThread = (threadId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    try {
      const threadData = sessionsStore.set('exportThread', threadId);
      const thread = threads.find(t => t.id === threadId);
      const filename = `thread-${thread?.name || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([threadData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export thread: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleImportThread = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const threadData = event.target?.result as string;
          sessionsStore.set('importThread', threadData);
        } catch (error) {
          alert('Failed to import thread: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex h-full w-100 flex-col border-r bg-muted/10">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Threads</h2>
          <div className="flex items-center gap-1">
            <Button onClick={handleImportThread} size="sm" variant="outline" className="h-8 w-8 p-0">
              <LuUpload className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateThread} size="sm" variant="outline" className="h-8 w-8 p-0">
              <LuPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="w-100 space-y-1 p-2">
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No threads yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create your first thread to get started
              </p>
            </div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.id}
                className={cn(
                  `
                    group relative max-w-full cursor-pointer overflow-hidden rounded-md p-2
                    transition-colors
                    hover:bg-muted/50
                  `,
                  activeThreadId === thread.id && 'bg-muted'
                )}
                onClick={() => sessionsStore.set('setActiveThread', thread.id)}
              >
                <div className="flex items-center gap-2">
                  {editingThreadId === thread.id ? (
                    <Input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onBlur={() => handleSaveEdit(thread.id)}
                      onKeyDown={e => handleKeyDown(e, thread.id)}
                      className="h-6 text-sm"
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <div className="relative min-w-0 flex-auto">
                        <div className="truncate text-sm font-medium" title={thread.name}>
                          {thread.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {thread.messages.filter(m => m.type !== 'model-choice').length} messages
                        </div>
                        {/* Gradient fade to ensure buttons are always visible */}
                        <div
                          className={`
                            pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l
                            from-muted/10 via-muted/5 to-transparent transition-colors
                            group-hover:from-muted/50 group-hover:via-muted/25
                          `}
                        />
                      </div>

                      <div className={'flex-none transition-opacity group-hover:opacity-100'}>
                        <Button
                          onClick={e => handleExportThread(thread.id, e)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          disabled={thread.isPending}
                        >
                          <LuDownload className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={e => handleStartEdit(thread.id, thread.name, e)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <LuPencil className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={e => handleDeleteThread(thread.id, e)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <LuTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {thread.isPending && (
                  <div className="absolute -top-1 -right-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
