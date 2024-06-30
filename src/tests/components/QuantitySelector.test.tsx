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

    const user = userEvent.setup();
    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: "Add to Cart" });

    const getQuantitySelectors = () => ({
      quantity: screen.queryByRole("status"),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      incrementButton: screen.queryByRole("button", { name: "+" }),
    });

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantitySelectors();
      await user.click(incrementButton!);
    };
    const decrementQuantity = async () => {
      const { decrementButton } = getQuantitySelectors();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      getQuantitySelectors,
      addToCart,
      decrementQuantity,
      incrementQuantity,
    };
  };
  test("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument();
  });

  test("should add the product to the cart", async () => {
    const { getAddToCartButton, addToCart, getQuantitySelectors } =
      renderComponent();

    await addToCart();
    const { quantity, decrementButton, incrementButton } =
      getQuantitySelectors();
    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  test("should increment the quantity", async () => {
    const { addToCart, incrementQuantity, getQuantitySelectors } =
      renderComponent();

    await addToCart();
    await incrementQuantity();

    const { quantity } = getQuantitySelectors();
    expect(quantity).toHaveTextContent("2");
  });

  test("should decrement the quantity", async () => {
    const {
      addToCart,
      incrementQuantity,
      decrementQuantity,
      getQuantitySelectors,
    } = renderComponent();

    await addToCart();
    await incrementQuantity();
    await decrementQuantity();

    const { quantity } = getQuantitySelectors();
    expect(quantity).toHaveTextContent("1");
  });
  test("should remove the product from the cart", async () => {
    const {
      getAddToCartButton,
      addToCart,
      decrementQuantity,
      getQuantitySelectors,
    } = renderComponent();

    await addToCart();
    await decrementQuantity();

    const { quantity, decrementButton, incrementButton } =
      getQuantitySelectors();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
