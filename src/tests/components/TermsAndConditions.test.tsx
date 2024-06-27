import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import TermsAndConditions from "../../components/TermsAndConditions";

describe("TermsAndConditions", () => {
  test("should render with correct text and initial state", () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Terms & Conditions");

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole("button", {
      name: /submit/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("should enabled button when checkbox is checked", async () => {
    render(<TermsAndConditions />);

    const checkbox = screen.getByRole("checkbox");
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(button).toBeEnabled();

    await user.click(checkbox);
    expect(button).toBeDisabled();
  });
});
