# How to update devcontainer.json

Whenever you change devcontainer.json, even a slight change (such as add an extension) needs a complete rebuild, which is equivalent to a full docker build. In order to both utilize devcontainer's way of managing features in a modular manner (by specifying features) and persist the docker build part, it is recommended to build development docker images with `devcontainer cli`.

## Installation

```shell
# npm is required
npm i -g @devcontainers/cli
```

## Build base image

```shell
# execute in workspace root directory
devcontainer build --workspace-folder ./devImages/base --image-name <IMAGE_NAME>:[<TAG>]
```

The `devcontainer.json` file should only specify `image` and `feature`, they are infrequently rebuilt.

```json
{
  "image": "mcr.microsoft.com/devcontainers/base:jammy",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {},
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers-contrib/features/deno:1": {},
    "ghcr.io/devcontainers-contrib/features/pre-commit:1": {},
    "ghcr.io/devcontainers/features/python:1": {},
    "ghcr.io/devcontainers-contrib/features/zsh-plugins:0": {},
    "ghcr.io/stuartleeks/dev-container-features/shell-history:0": {},
    "ghcr.io/guiyomh/features/vim:0": {},
    "../features/pnpm": {}
  },
  "overrideFeatureInstallOrder": ["ghcr.io/devcontainers/features/node"]
}

```

## Build dev image

Use image built from `base.json` as the base image in `devcontainer.json`, modify extensions, ports, customizations in this file.

``` json
{
  "image": "IMAGE_NAME:TAG",
  "forwardPorts": [3000],
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "alefragnani.Bookmarks",
        "aaron-bond.better-comments",
        "streetsidesoftware.code-spell-checker",
        "mhutchie.git-graph",
        "ms-vscode.vscode-typescript-next",
          "Gruntfuggly.todo-tree",
        "psioniq.psi-header"
      ]
    }
  }
}
```
