import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import AuthStatus from "../../components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  test("should render the loading message while fetching the auth status", async () => {
    mockAuthState({ isLoading: true, isAuthenticated: false, user: undefined });

    render(<AuthStatus />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should render the login button if the user is not authenticated", async () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  test("should render the user name if authenticated", async () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: {
        name: "Saeed",
        email: "HqRJi@example.com",
      },
    });

    render(<AuthStatus />);

    expect(screen.getByText("Saeed")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
