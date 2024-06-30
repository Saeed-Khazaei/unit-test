import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import routes from "../routes";

describe("Router", () => {
  test("should render the home page for /", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test("should render the products page for /products", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/products"],
    });
    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/products");
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
});
