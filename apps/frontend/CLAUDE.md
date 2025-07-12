# Agent Development UI

This is an internal debugging UI for the NotebookAgent project, implemented as a React application. This folder is relatively independent from the main codebase and serves as a development tool for testing and debugging agent functionality.

## Architecture

- **Framework**: React with React Router
- **Build Tool**: Rsbuild (with React plugin)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives

## Key Dependencies

### Core LangChain Integration
- `@langchain/anthropic`: Anthropic provider for Claude integration
- `@langchain/openai`: OpenAI provider integration
- `@langchain/core`: Core LangChain utilities

### UI Components & Libraries
- `shadcn`: CLI tool for component generation (`pnpm shadcn`)
- `react-icons`: Icon library (lucide-react icons)
- `@radix-ui/react-select`: Radix UI Select component
- `@radix-ui/react-slot`: Radix UI Slot component
- `class-variance-authority`: Utility for creating component variants
- `react-markdown`: Markdown renderer for React

### State Management & Utilities
- `zustand-x`: Extended Zustand for state management. Always check https://raw.githubusercontent.com/udecode/zustand-x/refs/heads/main/README.md and https://raw.githubusercontent.com/udecode/zustand-x/refs/heads/main/packages/zustand-x/src/tests/createStore.spec.ts for correct usage, as it has breaking changes with previous versions and your knowledge
- `immer`: Immutable state updates
- `json5`: JSON5 parser
- `@udecode/cn`: Utility functions for class names

## Development Commands

Ask user to do that for you, don't do it yourself

## Project Structure

```
.
├── app/                  # React Router application
│   ├── app.css          # Global CSS styles
│   ├── entry.client.tsx # Client-side entry point
│   ├── root.tsx         # Root component
│   ├── routes.ts        # Route configuration
│   └── routes/          # Route components
│       └── debug-llm.tsx
├── src/
│   ├── components/       # React components
│   │   ├── shadcn-ui/   # shadcn/ui components
│   │   ├── ai.tsx       # AI message component
│   │   ├── human.tsx    # Human message component
│   │   ├── message.tsx  # Message wrapper component
│   │   ├── model-choice.tsx # Model selection component
│   │   ├── system.tsx   # System message component
│   │   ├── thread.tsx   # Conversation thread component
│   │   ├── tool-definitions.tsx # Tool definitions display
│   │   └── tool.tsx     # Tool execution component
│   ├── models.ts        # Model type definitions
│   ├── request.ts       # API request utilities
│   └── zustand/         # Zustand state stores
│       └── sessions.ts  # Session management store
├── public/              # Static assets
├── build/               # Build output
├── uploads/             # File uploads
├── components.json      # shadcn/ui configuration
├── react-router.config.ts # React Router configuration
├── rsbuild.config.ts    # Rsbuild configuration
└── tsconfig.json        # TypeScript configuration
```

## Configuration

- **shadcn/ui**: Configured with New York style, TypeScript, and Tailwind CSS
- **Tailwind**: Using CSS variables and neutral base color
- **Icon Library**: Using Lucide React icons
- **Path Aliases**: 
  - `@/components` → components
  - `@/components/shadcn-ui` → ui components
  - `@udecode/cn` → utility functions
  - `@/lib` → lib utilities
  - `@/hooks` → custom hooks

## Features

- **AI Chat Interface**: Debug and test AI model interactions
- **Multiple Provider Support**: OpenAI and Anthropic integration
- **Tool Execution**: Visual display of tool calls and results
- **Session Management**: Persistent conversation state
- **Model Selection**: Switch between different AI models
- **Markdown Rendering**: Rich text display for AI responses

## Notes

- This is a development/debugging interface for internal use.