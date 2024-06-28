import { faker } from "@faker-js/faker";
import { describe, expect, test } from "vitest";

describe("group", () => {
  test("should", async () => {
    console.log("Faker", {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1, max: 100 }),
    });
    expect(3).toEqual(3);
  });
});
