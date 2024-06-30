import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import db from "./mocks/db";
import { navigateTo } from "./utils";

describe("Router", () => {
  test("should render the home page for /", async () => {
    navigateTo("/");

    // expect(router.state.location.pathname).toBe("/");
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test("should render the products page for /products", async () => {
    navigateTo("/products");

    // expect(router.state.location.pathname).toBe("/products");
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  test("should render the product details page for /products/:id", async () => {
    const product = db.product.create();
    navigateTo(`/products/${product.id}`);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  test("should render the not found page for invalid routes", async () => {
    navigateTo(`/invalid-route`);

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
