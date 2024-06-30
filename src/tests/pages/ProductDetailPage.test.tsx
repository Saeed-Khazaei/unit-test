import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Product } from "../../entities";
import db from "../mocks/db";
import { navigateTo } from "../utils";

describe("ProductDetailPage", () => {
  let product: Product;
  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });
  test("should render product details", async () => {
    navigateTo(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    expect(screen.getByText("$" + product.price)).toBeInTheDocument();
  });
});
