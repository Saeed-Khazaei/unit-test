import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import TermsAndConditions from "../../components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };
  test("should render with correct text and initial state", () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent("Terms & Conditions");
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  test("should enabled button when checkbox is checked", async () => {
    const { checkbox, button } = renderComponent();

    expect(button).toBeDisabled();

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(button).toBeEnabled();

    await user.click(checkbox);
    expect(button).toBeDisabled();
  });
});
