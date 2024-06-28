import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ProductForm from "../../components/ProductForm";
import { Category, Product } from "../../entities";
import AllProviders from "../AllProviders";
import db from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.deleteMany({ where: { id: { equals: category.id } } });
  });
  test("should render form fields", async () => {
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} />, { wrapper: AllProviders });

    // Use one of this below approaches to use await once and after that code can implement get queries
    await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      // screen.getByRole("textbox", { name: /name/i }) // aria-label="name"
      screen.getByPlaceholderText(/name/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

    const comboBox = screen.getByRole("combobox", { name: /category/i });
    expect(comboBox).toBeInTheDocument();
  });

  test("should populate form fields when editing a product", async () => {
    const onSubmit = vi.fn();
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 1000,
      categoryId: category.id,
    };
    render(<ProductForm onSubmit={onSubmit} product={product} />, {
      wrapper: AllProviders,
    });

    await screen.findByRole("form");

    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      product.price.toString()
    );

    const comboBox = screen.getByRole("combobox", { name: /category/i });
    expect(comboBox).toHaveTextContent(category.name);
  });
});
