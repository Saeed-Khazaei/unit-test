import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import ProductList from "../../components/ProductList";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import db from "../mocks/db";

describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    Array.from({ length: 3 }).forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
  test("should render the list of products", async () => {
    render(
      <>
        <ProductList />
      </>
    );

    expect(await screen.findByRole("list")).toBeInTheDocument();

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  test("should render no products available if no product is found", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );

    render(
      <>
        <ProductList />
      </>
    );
    const item = await screen.findByText(/no products/i);
    expect(item).toBeInTheDocument();
  });
});
