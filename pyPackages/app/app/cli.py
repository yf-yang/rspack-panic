#!/usr/bin/env python3

import json
import sys
from typing import Annotated

import requests
import typer


def main(
  url: Annotated[str, typer.Option(help="Base URL of the API")] = "http://localhost:10086",
  data: Annotated[
    str, typer.Option(help="JSON data to send to the endpoint")
  ] = '{ "hello": "world" }',
) -> None:
  """CLI tool to interact with the API."""

  print(f"Call {url}/echo_payload")
  try:
    parsed_data = json.loads(data)
    response = requests.post(f"{url}/echo_payload", json=parsed_data)
    typer.echo(f"Status code: {response.status_code}")
    typer.echo(json.dumps(response.json(), indent=2))
  except requests.RequestException as e:
    typer.echo(f"Error making request: {e}", err=True)
    raise typer.Exit(1)
  except json.JSONDecodeError:
    typer.echo(f"Error: Invalid JSON data: {data}", err=True)
    raise typer.Exit(1)
  except Exception as e:
    typer.echo(f"Unexpected error: {e}", err=True)
    raise typer.Exit(1)

  print()
  print(f"Call {url}/echo_request")
  try:
    parsed_data = json.loads(data)
    response = requests.post(f"{url}/echo_request", json=parsed_data)
    typer.echo(f"Status code: {response.status_code}")
    typer.echo(json.dumps(response.json(), indent=2))
  except requests.RequestException as e:
    typer.echo(f"Error making request: {e}", err=True)
    raise typer.Exit(1)
  except json.JSONDecodeError:
    typer.echo(f"Error: Invalid JSON data: {data}", err=True)
    raise typer.Exit(1)
  except Exception as e:
    typer.echo(f"Unexpected error: {e}", err=True)
    raise typer.Exit(1)


if __name__ == "__main__":
  typer.run(main)
