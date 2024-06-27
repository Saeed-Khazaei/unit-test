import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import UserAccount from "../../components/UserAccount";
import { User } from "../../entities";

describe("User Account ", () => {
  test("should render user name", () => {
    const user: User = {
      id: 1,
      name: "Saeed",
    };
    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  test("should render edit button if user is admin", () => {
    const user: User = {
      id: 1,
      name: "Saeed",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  test("should not render edit button if user is not admin", () => {
    const user: User = {
      id: 1,
      name: "Saeed",
    };
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button"); // because it need to find the button and it is not there we need to use query selector
    expect(button).not.toBeInTheDocument();
  });
});
