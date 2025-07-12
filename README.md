# TypeScript+Python Hybrid Monorepo Template

## Replace names
Globally search for word `whatever` and replace them all with your project name.
Update file names with `whatever` to your project name, too.

## Setup with Devcontainer
1. Install `Dev Containers` (id: ms-vscode-remote.remote-containers) extension for your editor.
2. Open the command palette (Ctrl+Shift+P or Cmd+Shift+P) and select `Dev Containers: Install devcontainer CLI`. [documentation](https://code.visualstudio.com/docs/devcontainers/devcontainer-cli#_installation)
3. Open the terminal, navigate to the project root and run the following command. It will create a docker image named `whatever:latest`.
```
devcontainer build --workspace-folder ./devImages/base --image-name whatever
```
> We separate the `devcontainer.json` into two parts, mainly because each time `devcontainer.json` is updated, the docker image will be rebuilt. Therefore, we will install the time-consuming features to rebuild (in a poor network environment) in a separate `devcontainer.json`, to obtain an intermediate docker image (`whatever:latest`). Subsequently, we will use this image to create the actual docker image intended for development.
4. Open the code workspace
```
cursor whatever.code-workspace
```
5. A prompt should pop up, asking you to `reopen in container`. Alternatively, you can open the command palette and select `Dev Containers: Reopen in Container`.
> In this step, the editor is checking the file `.devcontainer/devcontainer.json`, in that file, we configure multiple extensions and the base image (`whatever:latest`), so that the editor can create the actual development environment.
> If updating OhMyZsh hangs (because of the network), you can press `Ctrl+C` to cancel the installation and manually run `omz update` in the container at any time.
6. Now you can start developing in a containerized environment.

## Install extensions
Ideally, extensions should be installed when building devcontainer, but [cursor fails to do so](https://forum.cursor.com/t/extensions-in-devcontainer-not-installing-properly/20436/15). So we need to install them manually.

Check the extension list in [whatever.code-workspace](./whatever.code-workspace).

## Install dependencies
```
npm i -g concurrently
pnpm initialize
```
When the container is just built, `ms-vscode.js-debug/bootloader.js` may be not found and all node executables are not available. This is [a known issue](https://github.com/microsoft/vscode/issues/137794#issuecomment-978093998) with devcontainer.

To fix this, manually find "auto attach" at the bottom of the editor, adjust it to `Always`, then adjust it back to `Only With Flag`.

Alternatively, you can open the command pallette (Ctrl+Shift+P or Cmd+Shift+P) and select `Toggle Auto Attach`.

## Check Python environment is correctly configured
Reopen the terminal, then execute
```
which python # ${workspaceFolder}/.venv/bin/python
```
Ideally, the python should be the one in the virtual environment installed by uv, if not, you need to check if the initial `uv sync` (triggered by `pnpm initialize`) is successful.

## Prepare `.env` file
Create a `.env` file in the root directory and put secret variables in it.
```
ANTHROPIC_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
```

## Development
```
pnpm dev
```

## Demo Scripts
In [app/app/pyproject.toml](./app/pyproject.toml), we define two demo scripts:
- `demo_app` (which executes the `main` function in [app/app/cli.py](./app/app/cli.py))
- `demo_mongo` (which executes the `main` function in [app/app/mongo.py](./app/app/mongo.py))

They are available as commands after `uv sync`.

## Generate Backend API Types
```
# In frontend subfolder
pnpm gen-schema
```

## Development with MongoDB
Either vscode mongodb extension or `mongosh` command line tool can be used to connect to the MongoDB instance.

## Style guidelines
- No Chinese characters in code.
- All words should pass spell checker (code spell checker plugin), try not to use abbreviations, pinyin is not allowed.
- We've defined several macros for frontend code, check [macros](./configs/macro) for more details. They are replaced by `rsbuild` in development and are removed in production.
``` ts
// equivalent to process.env.NODE_ENV === 'development'
if (IS_DEV) {
  ...
}
// equivalent to process.env.NODE_ENV === 'production'
else if (IS_PROD) {
  ...
}

// logging
const logger = MAKE_LOGGER('namespace');
DEBUG(logger, 'debug message');
INFO(logger, 'formatted: %s, %d, %o', "string", 123, {"object": [ True ]});
WARN(logger, 'warning message');
ERROR(logger, 'error message');
TIME(logger);
TIME_LOG(logger, message1, message2);
TIME_END(logger);

// assertions
ASSERT(condition, message);
FAIL(message);
NOT_IMPLEMENTED();
// Used for exhaustive cases in switch/if statements
UNREACHABLE(value, message);

// add a debugger statement
DEBUGGER();
```


## Use zsh wisely
We prepare several oh-my-zsh plugins, such as
- git aliases
```
gst # git status
gl # git pull
gp # git push
gfo # git fetch origin
grbom # git rebase origin/main
gco # git checkout
gb # git branch

# Conventional commit messages
git feat "message" # git commit -m "feat: message"
git fix "message" # git commit -m "fix: message"
git chore "message" # git commit -m "chore: message"
git test "message" # git commit -m "test: message"
git docs "message" # git commit -m "docs: message"
...
```

- z
```
z parts_of_folder_path # jump to the directory you want
```
