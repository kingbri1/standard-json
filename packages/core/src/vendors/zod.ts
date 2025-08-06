import type { JSONSchema7 } from "json-schema";
import * as z from "zod/v4/core";
import type { ToJsonSchemaFn } from "./index.js";

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  return async (schema, options) => {
    const zodSchema = schema as z.$ZodType;

    return z.toJSONSchema(zodSchema,
      {
        target: "draft-7",
        io: "input",
        ...options,
        override: (ctx) => {
          // Required due to type errors
          if (options?.override && typeof options.override === 'function') {
            options.override(ctx);
          }

          // Flattens nested allOfs with intersections
          if (ctx.jsonSchema.allOf) {
            ctx.jsonSchema.allOf = ctx.jsonSchema.allOf.flatMap(schema => 
              schema.allOf ? schema.allOf : [schema]
            );
          }
        },
      }
    ) as JSONSchema7;
  }
};
