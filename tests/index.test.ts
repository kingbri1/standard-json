import { type } from "arktype";
import * as v from "valibot";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import * as z from "zod";

import { toJsonSchema } from "../src";

describe("basic", () => {
  it("arktype", async () => {
    const schema = type({
      myString: "string",
      myUnion: "number | boolean",
    }).describe("My neat object schema");

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });

  it.skip("effect", async () => {
    const schema = Schema.Struct({
      myString: Schema.String,
      myUnion: Schema.Union(Schema.Number, Schema.Boolean),
    });

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });

  it("valibot", async () => {
    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description("My neat object schema"),
    );

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });

  it("zod", async () => {
    const schema = z
      .object({
        myString: z.string(),
        myUnion: z.union([z.number(), z.boolean()]),
      })
      .describe("My neat object schema");

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });
});
