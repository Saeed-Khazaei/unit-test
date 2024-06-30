import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { navigateTo } from "./utils";

describe("Router", () => {
  test("should render the home page for /", async () => {
    navigateTo("/");

    // expect(router.state.location.pathname).toBe("/");
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test("should render the products page for /products", async () => {
    navigateTo("/products");

    // expect(router.state.location.pathname).toBe("/products");
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
});
