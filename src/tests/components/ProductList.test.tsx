import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import { describe, expect, test } from "vitest";
import ProductList from "../../components/ProductList";
import db from "../mocks/db";
import { server } from "../mocks/server";
import { QueryClient, QueryClientProvider } from "react-query";

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

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  test("should render the list of products", async () => {
    renderComponent();

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

    renderComponent();

    const item = await screen.findByText(/no products/i);
    expect(item).toBeInTheDocument();
  });

  test("should render an error message if an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(500);
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  test("should remove the loading indicator after data is fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  test("should remove the loading indicator if data fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
