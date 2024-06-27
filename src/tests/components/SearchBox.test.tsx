import { render, screen } from "@testing-library/react";
import { test, expect, describe, vi } from "vitest";
import SearchBox from "../../components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      onChange,
      input: screen.getByRole("textbox"),
      user: userEvent.setup(),
    };
  };
  test("should render an input field for searching", async () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });
  test("should call onChange when Enter is pressed", async () => {
    const { onChange, input, user } = renderComponent();

    const searchTerm = "serach";
    await user.type(input, searchTerm + "{enter}"); // it mean after typing 'test' then press 'enter' button

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  test("should not call onChange if input field is empty", async () => {
    const { onChange, input, user } = renderComponent();

    await user.type(input, "{enter}"); // it mean after typing 'test' then press 'enter' button

    expect(onChange).not.toHaveBeenCalled();
  });
});
