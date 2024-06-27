import { render, screen } from "@testing-library/react"; // itr
import { describe, expect, test } from "vitest"; //iv
import Greet from "../../components/Greet";
describe("Greet", () => {
  test("should render Hello with the name is provided", () => {
    render(<Greet name="saeed" />);

    const headingElement = screen.getByRole("heading");

    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(/saeed/i);
  });

  test("should render login button when name is not provided", () => {
    render(<Greet name="" />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
