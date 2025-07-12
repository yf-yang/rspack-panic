import json
from pathlib import Path

from inflection import camelize, underscore
from pydantic import BaseModel
from pydantic._internal._core_utils import CoreSchemaOrField
from pydantic.json_schema import GenerateJsonSchema, JsonSchemaValue
from pydantic_core import core_schema

from app.main import app


class _Schema(BaseModel):
  """
  This is a dummy class to export classes to the frontend.
  To export keys, declare as dummy_key's union type.
  """

  # Replace with the keys you want to export.
  dummy_key: str | int


class CustomGenerateJsonSchema(GenerateJsonSchema):
  def field_title_should_be_set(self, schema: CoreSchemaOrField) -> bool:
    """
    Avoid setting titles for primitive types. They'll mess up the TypeScript generated code.
    """
    if schema["type"] in (
      "str",
      "int",
      "float",
      "bool",
      "list",
      "dict",
      "tuple",
      "set",
      "frozenset",
      "literal",
    ):
      return False
    return super().field_title_should_be_set(schema)

  def enum_schema(self, schema: core_schema.EnumSchema) -> JsonSchemaValue:
    """
    Add tsEnumNames to the enum schema.
    See https://github.com/bcherny/json-schema-to-typescript/?tab=readme-ov-file#custom-schema-properties
    for more details.
    """
    schema_value = super().enum_schema(schema)
    schema_value["tsEnumNames"] = [camelize(underscore(value)) for value in schema_value["enum"]]
    return schema_value


def main() -> None:
  """Main function that generates the OpenAPI schema and writes it to the pyPackages/app/ folder."""
  output_dir = Path(__file__).parent.parent
  openapi_path = output_dir / "openapi.json"

  openapi_schema = app.openapi()
  with open(openapi_path, "w") as f:
    json.dump(openapi_schema, f, indent=2)

  print(f"OpenAPI schema saved to {openapi_path.absolute()}")

  json_schema = _Schema.model_json_schema(schema_generator=CustomGenerateJsonSchema)

  schema_path = output_dir / "schema.json"

  with open(schema_path, "w") as f:
    json.dump(json_schema, f, indent=2)

  print(f"{len(json_schema['properties'])} json schema saved to {schema_path.absolute()}")
