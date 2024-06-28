import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { test, expect, describe } from "vitest";
import BrowseProductsPage from "../../pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";
import userEvent from "@testing-library/user-event";
import db from "../mocks/db";
import { Category, Product } from "../../entities";
import { CartProvider } from "../../providers/CartProvider";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(
        db.category.create({
          name: "Category" + item,
        })
      );
    });
    Array(5).forEach(() => {
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.product.deleteMany({ where: { id: { in: categoryIds } } });
    const productIds = categories.map((product) => product.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProductsPage />
        </Theme>
      </CartProvider>
    );
  };
  test("should render", async () => {
    renderComponent();

    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });

  test("should show a loading skeleton when fetching categories", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: "categories-loading" })
    ).toBeInTheDocument();
  });

  test("should hide the loading skeleton after categories are fetched ", async () => {
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "categories-loading",
      })
    );
  });
  test("should show a loading skeleton when fetching products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: "products-loading" })
    ).toBeInTheDocument();
  });

  test("should hide the loading skeleton after products are fetched ", async () => {
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "products-loading",
      })
    );
  });

  test("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "categories-loading",
      })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  test("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "products-loading",
      })
    );
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });

  test("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  test("should render products", async () => {
    renderComponent();

    waitForElementToBeRemoved(
      await screen.queryByRole("progressbar", {
        name: "products-loading",
      })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
