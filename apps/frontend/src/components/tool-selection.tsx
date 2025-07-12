import JSON5 from 'json5';
import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { LuPencil, LuTrash2, LuPlus, LuDownload, LuUpload } from 'react-icons/lu';
import { useStoreValue } from 'zustand-x';

import { Badge } from '@/components/shadcn-ui/badge';
import { Button } from '@/components/shadcn-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import { Input } from '@/components/shadcn-ui/input';
import { Textarea } from '@/components/shadcn-ui/textarea';
import { sessionsStore, type ToolDefinition } from '@/zustand/sessions';

export function ToolSelectionUI({ threadId }: { threadId: string }): ReactNode {
  const toolDefinitions = useStoreValue(sessionsStore, 'toolDefinitions');
  const thread = useStoreValue(sessionsStore, 'threads').find(t => t.id === threadId);
  const [editingTool, setEditingTool] = useState<{ index: number; tool: ToolDefinition } | null>(
    null
  );
  const [newTool, setNewTool] = useState<ToolDefinition>({ name: '', description: '', schema: '' });
  const [isAddingTool, setIsAddingTool] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!thread) {
    return null;
  }

  const handleToolToggle = (toolName: string): void => {
    if (thread.tools.includes(toolName)) {
      sessionsStore.set('removeToolFromThread', threadId, toolName);
    } else {
      sessionsStore.set('addToolToThread', threadId, toolName);
    }
  };

  const handleEditTool = (index: number, tool: ToolDefinition): void => {
    setEditingTool({ index, tool: { ...tool } });
  };

  const handleUpdateTool = (): void => {
    if (editingTool) {
      const tool = { ...editingTool.tool, name: editingTool.tool.name.trim() };
      // If tool name exists, alert user
      if (toolDefinitions.findIndex(t => t.name === tool.name) !== editingTool.index) {
        alert('Tool name already exists. Please choose a different name.');
        return;
      }
      sessionsStore.set('updateToolDefinition', editingTool.index, tool);
      setEditingTool(null);
    }
  };

  const handleDeleteTool = (index: number): void => {
    if (
      confirm('Are you sure you want to delete this tool? It will be removed from all threads.')
    ) {
      sessionsStore.set('deleteToolDefinition', index);
    }
  };

  const handleAddTool = (): void => {
    // If tool name exists, alert user
    if (toolDefinitions.some(t => t.name === newTool.name)) {
      alert('Tool name already exists. Please choose a different name.');
      return;
    }
    sessionsStore.set('addToolDefinition', newTool);
    setNewTool({ name: '', description: '', schema: '' });
    setIsAddingTool(false);
  };

  const handleFormatJson = (schema: string, onUpdate: (formatted: string) => void): void => {
    try {
      const parsed = JSON5.parse<object>(schema);
      const formatted = JSON5.stringify(parsed, null, 2);
      onUpdate(formatted);
    } catch {
      alert('Invalid JSON format');
    }
  };

  const validateJson = (schema: string): { isValid: boolean; error?: string } => {
    try {
      JSON5.parse<object>(schema);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid JSON' };
    }
  };

  const handleExportTools = (): void => {
    try {
      const toolsData = sessionsStore.set('exportToolDefinitions');
      const filename = `tool-definitions-${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([toolsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export tools: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleImportTools = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const toolsData = event.target?.result as string;
          sessionsStore.set('importToolDefinitions', toolsData);
        } catch (error) {
          alert('Failed to import tools: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Available Tools</Badge>
            <Badge variant="secondary" className="text-xs">
              {thread.tools.length} selected
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportTools} variant="outline" size="sm">
              <LuDownload className="mr-1 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleImportTools} variant="outline" size="sm">
              <LuUpload className="mr-1 h-4 w-4" />
              Import
            </Button>
            <Dialog open={isAddingTool} onOpenChange={setIsAddingTool}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LuPlus className="mr-1 h-4 w-4" />
                  Add Tool
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tool</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tool Name</label>
                  <Input
                    value={newTool.name}
                    onChange={e => setNewTool({ ...newTool, name: e.target.value })}
                    placeholder="Enter tool name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newTool.description}
                    onChange={e => setNewTool({ ...newTool, description: e.target.value })}
                    placeholder="Enter tool description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Schema (JSON)</label>
                  <div className="mb-2 text-sm text-muted-foreground">
                    Use the{' '}
                    <a
                      href="https://json.ophir.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      JSON Schema Builder
                    </a>{' '}
                    to visually create your schema
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleFormatJson(newTool.schema, formatted =>
                          setNewTool({ ...newTool, schema: formatted })
                        )
                      }
                    >
                      Format JSON
                    </Button>
                    <Textarea
                      value={newTool.schema}
                      onChange={e => setNewTool({ ...newTool, schema: e.target.value })}
                      placeholder="Enter tool schema as JSON"
                      className="min-h-[100px] font-mono text-sm"
                    />
                    {
                      <div className="text-sm">
                        {validateJson(newTool.schema).isValid ? (
                          <span className="text-green-600">✓ Valid JSON</span>
                        ) : (
                          <span className="text-red-600">
                            ✗ Invalid JSON: {validateJson(newTool.schema).error}
                          </span>
                        )}
                      </div>
                    }
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTool}
                    disabled={!newTool.name.trim() || !validateJson(newTool.schema).isValid}
                  >
                    Add Tool
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTool(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {toolDefinitions.map((tool, index) => (
            <div
              key={index}
              id={`tool-def-${tool.name}`}
              className={`
                flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 transition-colors
                ${
                  thread.tools.includes(tool.name)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              onClick={() => handleToolToggle(tool.name)}
            >
              <span className="text-sm font-medium">{tool.name}</span>
              <div className="flex items-center gap-1">
                <Dialog
                  open={editingTool?.index === index}
                  onOpenChange={open => !open && setEditingTool(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={e => {
                        e.stopPropagation();
                        handleEditTool(index, tool);
                      }}
                    >
                      <LuPencil className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Tool</DialogTitle>
                    </DialogHeader>
                    {editingTool && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Tool Name</label>
                          <Input
                            value={editingTool.tool.name}
                            onChange={e => {
                              setEditingTool({
                                ...editingTool,
                                tool: { ...editingTool.tool, name: e.target.value },
                              });
                            }}
                            placeholder="Enter tool name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            value={editingTool.tool.description}
                            onChange={e =>
                              setEditingTool({
                                ...editingTool,
                                tool: { ...editingTool.tool, description: e.target.value },
                              })
                            }
                            placeholder="Enter tool description"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Schema (JSON)</label>
                          <div className="mb-2 text-sm text-muted-foreground">
                            Use the{' '}
                            <a
                              href="https://json.ophir.dev/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              JSON Schema Builder
                            </a>{' '}
                            to visually create your schema
                          </div>
                          <div className="space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleFormatJson(editingTool.tool.schema, formatted =>
                                  setEditingTool({
                                    ...editingTool,
                                    tool: { ...editingTool.tool, schema: formatted },
                                  })
                                )
                              }
                            >
                              Format JSON
                            </Button>
                            <Textarea
                              value={editingTool.tool.schema}
                              onChange={e => {
                                setEditingTool({
                                  ...editingTool,
                                  tool: { ...editingTool.tool, schema: e.target.value },
                                });
                              }}
                              placeholder="Enter tool schema as JSON"
                              className="min-h-[100px] font-mono text-sm"
                            />
                            {
                              <div className="text-sm">
                                {validateJson(editingTool.tool.schema).isValid ? (
                                  <span className="text-green-600">✓ Valid JSON</span>
                                ) : (
                                  <span className="text-red-600">
                                    ✗ Invalid JSON: {validateJson(editingTool.tool.schema).error}
                                  </span>
                                )}
                              </div>
                            }
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateTool}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setEditingTool(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteTool(index);
                  }}
                >
                  <LuTrash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {toolDefinitions.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No tools available. Add one to get started.
          </div>
        )}
      </CardContent>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Card>
  );
}
