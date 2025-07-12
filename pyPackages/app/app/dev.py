#!/usr/bin/env python3
"""
Copied from fastapi CLI implementation
https://github.com/fastapi/fastapi-cli/blob/main/src/fastapi_cli/cli.py
Some more custom options of uvicorn are added
"""

import logging
from pathlib import Path
from typing import Annotated, Any

import typer
import uvicorn
from fastapi_cli.discover import get_import_data
from fastapi_cli.exceptions import FastAPICLIException
from rich.tree import Tree
from rich_toolkit import RichToolkit, RichToolkitTheme
from rich_toolkit.styles import TaggedStyle
from uvicorn.logging import DefaultFormatter

app = typer.Typer(rich_markup_mode="rich")


class CustomFormatter(DefaultFormatter):
  def __init__(self, *args: Any, **kwargs: Any) -> None:
    super().__init__(*args, **kwargs)
    self.toolkit = get_rich_toolkit()

  def formatMessage(self, record: logging.LogRecord) -> str:
    return self.toolkit.print_as_string(record.getMessage(), tag=record.levelname)


def get_uvicorn_log_config() -> dict[str, Any]:
  return {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
      "default": {
        "()": CustomFormatter,
        "fmt": "%(levelprefix)s %(message)s",
        "use_colors": None,
      },
      "access": {
        "()": CustomFormatter,
        "fmt": "%(levelprefix)s %(client_addr)s - '%(request_line)s' %(status_code)s",
      },
    },
    "handlers": {
      "default": {
        "formatter": "default",
        "class": "logging.StreamHandler",
        "stream": "ext://sys.stderr",
      },
      "access": {
        "formatter": "access",
        "class": "logging.StreamHandler",
        "stream": "ext://sys.stdout",
      },
    },
    "loggers": {
      "uvicorn": {"handlers": ["default"], "level": "INFO"},
      "uvicorn.error": {"level": "INFO"},
      "uvicorn.access": {
        "handlers": ["access"],
        "level": "INFO",
        "propagate": False,
      },
    },
  }


logger = logging.getLogger(__name__)


def get_rich_toolkit() -> RichToolkit:
  theme = RichToolkitTheme(
    style=TaggedStyle(tag_width=11),
    theme={
      "tag.title": "white on #009485",
      "tag": "white on #007166",
      "placeholder": "grey85",
      "text": "white",
      "selected": "#007166",
      "result": "grey85",
      "progress": "on #007166",
      "error": "red",
      "log.info": "black on blue",
    },
  )

  return RichToolkit(theme=theme)


def _get_module_tree(module_paths: list[Path]) -> Tree:
  root = module_paths[0]
  name = f"🐍 {root.name}" if root.is_file() else f"📁 {root.name}"

  root_tree = Tree(name)

  if root.is_dir():
    root_tree.add("[dim]🐍 __init__.py[/dim]")

  tree = root_tree
  for sub_path in module_paths[1:]:
    sub_name = f"🐍 {sub_path.name}" if sub_path.is_file() else f"📁 {sub_path.name}"
    tree = tree.add(sub_name)
    if sub_path.is_dir():
      tree.add("[dim]🐍 __init__.py[/dim]")

  return root_tree


def _run(
  path: Path | None = None,
  *,
  host: str = "127.0.0.1",
  port: int = 8000,
  reload: bool = True,
  reload_dirs: list[str] | None = None,
  reload_includes: list[str] | None = None,
  reload_excludes: list[str] | None = None,
  workers: int | None = None,
  root_path: str = "",
  command: str,
  app: str | None = None,
  proxy_headers: bool = False,
) -> None:
  with get_rich_toolkit() as toolkit:
    server_type = "development" if command == "dev" else "production"

    toolkit.print_title(f"Starting {server_type} server 🚀", tag="FastAPI")
    toolkit.print_line()

    toolkit.print(
      "Searching for package file structure from directories with [blue]__init__.py[/blue] files"
    )

    try:
      import_data = get_import_data(path=path, app_name=app)
    except FastAPICLIException as e:
      toolkit.print_line()
      toolkit.print(f"[error]{e}")
      raise typer.Exit(code=1) from None

    logger.debug(f"Importing from {import_data.module_data.extra_sys_path}")
    logger.debug(f"Importing module {import_data.module_data.module_import_str}")

    module_data = import_data.module_data
    import_string = import_data.import_string

    toolkit.print(f"Importing from {module_data.extra_sys_path}")
    toolkit.print_line()

    root_tree = _get_module_tree(module_data.module_paths)

    toolkit.print(root_tree, tag="module")
    toolkit.print_line()

    toolkit.print(
      "Importing the FastAPI app object from the module with the following code:",
      tag="code",
    )
    toolkit.print_line()
    toolkit.print(
      f"[underline]from [bold]{module_data.module_import_str}[/bold] import [bold]{import_data.app_name}[/bold]"
    )
    toolkit.print_line()

    toolkit.print(
      f"Using import string: [blue]{import_string}[/]",
      tag="app",
    )

    url = f"http://{host}:{port}"
    url_docs = f"{url}/docs"

    toolkit.print_line()
    toolkit.print(
      f"Server started at [link={url}]{url}[/]",
      f"Documentation at [link={url_docs}]{url_docs}[/]",
      tag="server",
    )

    if command == "dev":
      toolkit.print_line()
      toolkit.print(
        "Running in development mode, for production use: [bold]fastapi run[/]",
        tag="tip",
      )

    if not uvicorn:
      raise FastAPICLIException(
        "Could not import Uvicorn, try running 'pip install uvicorn'"
      ) from None

    toolkit.print_line()
    toolkit.print("Logs:")
    toolkit.print_line()

    uvicorn.run(
      app=import_string,
      host=host,
      port=port,
      reload=reload,
      reload_dirs=reload_dirs,
      reload_includes=reload_includes,
      reload_excludes=reload_excludes,
      workers=workers,
      root_path=root_path,
      proxy_headers=proxy_headers,
      log_config=get_uvicorn_log_config(),
    )


@app.command()
def dev(
  path: Annotated[
    Path | None,
    typer.Argument(
      help="A path to a Python file or package directory (with [blue]__init__.py[/blue] files) containing a [bold]FastAPI[/bold] app. If not provided, a default set of paths will be tried."
    ),
  ] = None,
  *,
  host: Annotated[
    str,
    typer.Option(
      help="The host to serve on. For local development in localhost use [blue]127.0.0.1[/blue]. To enable public access, e.g. in a container, use all the IP addresses available with [blue]0.0.0.0[/blue]."
    ),
  ] = "127.0.0.1",
  port: Annotated[
    int,
    typer.Option(
      help="The port to serve on. You would normally have a termination proxy on top (another program) handling HTTPS on port [blue]443[/blue] and HTTP on port [blue]80[/blue], transferring the communication to your app."
    ),
  ] = 8000,
  reload: Annotated[
    bool,
    typer.Option(
      help="Enable auto-reload of the server when (code) files change. This is [bold]resource intensive[/bold], use it only during development."
    ),
  ] = True,
  reload_dir: Annotated[
    list[str],
    typer.Option(
      help="Set reload directories explicitly, instead of using the current working directory.",
      default_factory=list,
    ),
  ],
  reload_include: Annotated[
    list[str],
    typer.Option(
      help="Set glob patterns to include while watching for files. Includes '*.py' by default, which can be overridden in reload-excludes.",
      default_factory=list,
    ),
  ],
  reload_exclude: Annotated[
    list[str],
    typer.Option(
      help="Set glob patterns to exclude while watching for files. Includes '.*, .py[cod], .sw.*, ~*' by default, which can be overridden in reload-excludes.",
      default_factory=list,
    ),
  ],
  root_path: Annotated[
    str,
    typer.Option(
      help="The root path is used to tell your app that it is being served to the outside world with some [bold]path prefix[/bold] set up in some termination proxy or similar."
    ),
  ] = "",
  app: Annotated[
    str | None,
    typer.Option(
      help="The name of the variable that contains the [bold]FastAPI[/bold] app in the imported module or package. If not provided, it is detected automatically."
    ),
  ] = None,
  proxy_headers: Annotated[
    bool,
    typer.Option(
      help="Enable/Disable X-Forwarded-Proto, X-Forwarded-For, X-Forwarded-Port to populate remote address info."
    ),
  ] = True,
) -> None:
  """
  Run a [bold]FastAPI[/bold] app in [yellow]development[/yellow] mode. 🧪

  This is equivalent to [bold]fastapi run[/bold] but with [bold]reload[/bold] enabled and listening on the [blue]127.0.0.1[/blue] address.

  It automatically detects the Python module or package that needs to be imported based on the file or directory path passed.

  If no path is passed, it tries with:

  - [blue]main.py[/blue]
  - [blue]app.py[/blue]
  - [blue]api.py[/blue]
  - [blue]app/main.py[/blue]
  - [blue]app/app.py[/blue]
  - [blue]app/api.py[/blue]

  It also detects the directory that needs to be added to the [bold]PYTHONPATH[/bold] to make the app importable and adds it.

  It detects the [bold]FastAPI[/bold] app object to use. By default it looks in the module or package for an object named:

  - [blue]app[/blue]
  - [blue]api[/blue]

  Otherwise, it uses the first [bold]FastAPI[/bold] app found in the imported module or package.
  """
  _run(
    path=path,
    host=host,
    port=port,
    reload=reload,
    reload_dirs=reload_dir,
    reload_includes=reload_include,
    reload_excludes=reload_exclude,
    root_path=root_path,
    app=app,
    command="dev",
    proxy_headers=proxy_headers,
  )


def main() -> None:
  app()
