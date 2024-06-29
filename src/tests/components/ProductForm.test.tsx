import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} product={product} />, {
      wrapper: AllProviders,
    });
    return {
      onSubmit,
      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
        };
      },
    };
  };
  test("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    // Use one of this below approaches to use await once and after that code can implement get queries
    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // screen.getByRole("textbox", { name: /name/i }) // aria-label="name"
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  test("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 1000,
      categoryId: category.id,
    };
    const { waitForFormToLoad } = renderComponent(product);

    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  test("should put focus on name input", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  test.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is missing $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();
      const user = userEvent.setup();
      if (name !== undefined) {
        await user.type(form.nameInput, name);
      }
      await user.type(form.priceInput, "10");
      await user.click(form.categoryInput);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.submitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );
});
