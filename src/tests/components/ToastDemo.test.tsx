import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import ToastDemo from "../../components/ToastDemo";
import { Toaster } from "react-hot-toast";
import userEvent from "@testing-library/user-event";

describe("ToastDemo", () => {
  test("should render a toast", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
    screen.debug();
    // expect(screen.getByRole("alert")).toBeInTheDocument();
    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});
