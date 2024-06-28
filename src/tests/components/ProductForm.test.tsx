import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ProductForm from "../../components/ProductForm";
import AllProviders from "../AllProviders";

describe("ProductForm", () => {
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
});
