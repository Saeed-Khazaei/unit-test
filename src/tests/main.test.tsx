import { describe, expect, test } from "vitest";
import db from "./mocks/db";

describe("group", () => {
  test("should", async () => {
    const product = db.product.create();
    console.log("Faker", product);
    expect(3).toEqual(3);
  });
});
