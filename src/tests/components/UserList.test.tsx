import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import UserList from "../../components/UserList";
import { User } from "../../entities";

describe("User List", () => {
  test("should render no users when the users is empty", () => {
    render(<UserList users={[]} />);

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
    screen.debug();
  });
  test("should render a list of users", () => {
    const users: User[] = [
      {
        id: 1,
        name: "Saeed",
      },
      {
        id: 2,
        name: "Khazaei",
      },
    ];
    render(<UserList users={users} />);
    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });

    // more ...
    const items = screen.getAllByRole("listitem");
    expect(items).not.toHaveLength(0);
    screen.debug();
  });
});
