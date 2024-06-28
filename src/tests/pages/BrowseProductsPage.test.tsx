import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Category, Product } from "../../entities";
import BrowseProductsPage from "../../pages/BrowseProductsPage";
import { CartProvider } from "../../providers/CartProvider";
import db from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({
        name: "Category" + item,
      });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
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

    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", {
          name: "products-loading",
        }),
      getCategoriesSkeleton: () =>
        screen.queryByRole("progressbar", {
          name: "categories-loading",
        }),
      user: userEvent.setup(),
      getCategoriesComboBox: () => screen.queryByRole("combobox"),
    };
  };
  test("should render", async () => {
    renderComponent();

    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });

  test("should show a loading skeleton when fetching categories", async () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  test("should hide the loading skeleton after categories are fetched ", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });
  test("should show a loading skeleton when fetching products", async () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  test("should hide the loading skeleton after products are fetched ", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  test("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  test("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });

  test("should render categories", async () => {
    const { user, getCategoriesSkeleton, getCategoriesComboBox } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  test("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  test("should filter products by category", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    await user.click(combobox!);

    const selectedCategory = categories[0];
    const option = screen.getByRole("option", { name: selectedCategory.name });
    await user.click(option);

    // const allProducts = db.product.getAll();
    // console.log("allProducts", allProducts);
    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });
    // console.log("products", products);
    // expect(screen.getByText(products[0].name)).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  test("should render all products if All category is selected", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    await user.click(combobox!);

    const option = screen.getByRole("option", { name: /all/i });
    await user.click(option);

    const products = db.product.getAll();
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
