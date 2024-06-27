import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import ExpandableText from "../../components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";
  test("should render the full text if less than 255 characters", () => {
    const text = "test";
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    // expect(screen.getByText(text)).toHaveTextContent(text); Also works
  });

  test("should truncate text if longer than 255 characters", () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    // expect(screen.getByText(truncatedText)).toHaveTextContent(truncatedText); Also works

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });

  test("should expand text when show more button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    // expect(screen.getByText(longText)).toHaveTextContent(longText); Also works
    expect(button).toHaveTextContent(/less/i);
  });

  test("should collapse text when show less button is clicked", async () => {
    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    // expect(screen.getByText(longText)).toHaveTextContent(longText); Also works
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
