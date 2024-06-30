import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import QuantitySelector from "../../components/QuantitySelector";
import { Product } from "../../entities";
import { CartProvider } from "../../providers/CartProvider";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "iPhone",
      price: 10,
      categoryId: 1,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      addToCartButton: screen.getByRole("button", { name: "Add to Cart" }),
      getQuantity: () => screen.queryByRole("status"),
      getDecrementButton: () => screen.queryByRole("button", { name: "-" }),
      getIncrementButton: () => screen.queryByRole("button", { name: "+" }),
      user: userEvent.setup(),
    };
  };
  test("should render the Add to Cart button", () => {
    const { addToCartButton } = renderComponent();

    expect(addToCartButton).toBeInTheDocument();
  });

  test("should add the product to the cart", async () => {
    const {
      addToCartButton,
      user,
      getQuantity,
      getDecrementButton,
      getIncrementButton,
    } = renderComponent();

    await user.click(addToCartButton);

    expect(getQuantity()).toHaveTextContent("1");
    expect(getDecrementButton()).toBeInTheDocument();
    expect(getIncrementButton()).toBeInTheDocument();
    expect(addToCartButton).not.toBeInTheDocument();
  });

  test("should increment the quantity", async () => {
    const { addToCartButton, user, getQuantity, getIncrementButton } =
      renderComponent();

    await user.click(addToCartButton);
    await user.click(getIncrementButton()!);

    expect(getQuantity()).toHaveTextContent("2");
  });

  test("should decrement the quantity", async () => {
    const { addToCartButton, user, getQuantity, getDecrementButton } =
      renderComponent();
    await user.click(addToCartButton);

    await user.click(getDecrementButton()!);

    expect(getQuantity()).not.toBeInTheDocument();
  });
});
