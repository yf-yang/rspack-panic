from typing import Any, TypedDict

import dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

dotenv.load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.post("/echo_payload")
async def echo(payload: dict[Any, Any]) -> dict:
  # In this example, the payload is already a loaded JSON object
  return {
    "payload": payload,
  }


@app.post("/echo_request")
async def echo_request(request: Request) -> dict:
  # In this example, the request is a raw HTTP request, so we need to call json() to get the payload
  return {
    "request.json()": await request.json(),
  }


class Sample(TypedDict):
  name: str
  age: int


@app.post("/sample")
async def sample(sample: Sample) -> dict:
  return {
    "sample": sample,
  }


@app.get("/test")
async def test() -> str:
  return "connected"
