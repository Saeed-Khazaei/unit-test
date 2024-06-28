import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, test } from "vitest";
import ProductDetail from "../../components/ProductDetail";
import db from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;
  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { equals: productId } } });
  });

  test("should render the product detail", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  test("should render message if product is not found", async () => {
    // render(<ProductDetail productId={5} />);
    // screen.debug();
    // expect(await screen.findByText(/not found/i)).toBeInTheDocument();

    server.use(http.get("/products/1", () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  test("should render an error for invalid productId", async () => {
    render(<ProductDetail productId={0} />);
    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });

  test("should render an error for server error", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
