import type { JSONSchema7 } from "json-schema";
import type { ZodSchema } from "zod";
import * as z4 from "zod/v4/core";
import { tryImport, type ToJsonSchemaFn } from "./index.js";

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  return async (schema, options) => {
    const zodSchema = schema as ZodSchema<unknown>;

    // Zod 4 or 3
    if ("_zod" in zodSchema) {
      return z4.toJSONSchema(
        zodSchema as z4.$ZodType,
        { target: "draft-7" }
      ) as JSONSchema7;
    } else {
      const { zodToJsonSchema } = await tryImport(
        import("zod-to-json-schema"),
        "zod-to-json-schema",
      );

      return zodToJsonSchema(
        zodSchema,
        options as Record<string, unknown>,
      ) as JSONSchema7;
    }
  }
};
