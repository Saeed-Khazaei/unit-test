import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import ProductDetail from "../../components/ProductDetail";
import { products } from "../mocks/data";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

describe("ProductDetail", () => {
  test("should render the product detail", async () => {
    render(<ProductDetail productId={1} />);

    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
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
});
