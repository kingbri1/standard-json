import type { JSONSchema7 } from "json-schema";
import type { ZodTypeAny } from "zod";
import * as z4 from "zod/v4/core";
import { tryImport, type ToJsonSchemaFn } from "./index.js";

type Schema = ZodTypeAny | z4.$ZodType

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  return async (schema, options) => {
    const zodSchema = schema as Schema;

    // Zod 4 or 3
    if ("_zod" in zodSchema) {
      return z4.toJSONSchema(
        zodSchema as z4.$ZodType,
        {
          target: "draft-7",
          io: "input",
          override: (ctx) => {
            // Flattens nested allOfs with intersections
            if (ctx.jsonSchema.allOf) {
              ctx.jsonSchema.allOf = ctx.jsonSchema.allOf.flatMap(schema => 
                schema.allOf ? schema.allOf : [schema]
              );
            }
          }
        }
      ) as JSONSchema7;
    } else {
      const { zodToJsonSchema } = await tryImport(
        import("zod-to-json-schema"),
        "zod-to-json-schema",
      );

      return zodToJsonSchema(
        zodSchema as ZodTypeAny,
        options as Record<string, unknown>,
      ) as JSONSchema7;
    }
  }
};
