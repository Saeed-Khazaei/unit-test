import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import OrderStatusSelector from "../../components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      onChange,
      button: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOption: (label: RegExp) => screen.getByRole("option", { name: label }),
      getOptions: () => screen.findAllByRole("option"), // this technique is called lazy evaluation which means it will not be evaluated until it is needed (postpone execution of it)
    };
  };
  test("should render New as default value", () => {
    const { button } = renderComponent();

    expect(button).toHaveTextContent(/new/i);
  });
  test("should render correct statuses", async () => {
    const { button, user, getOptions } = renderComponent();
    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  test.each([
    {
      label: /processed/i,
      value: "processed",
    },
    {
      label: /fulfilled/i,
      value: "fulfilled",
    },
  ])(
    "should call onChange with $value when the $label option is selected",
    async ({ label, value }) => {
      const { button, user, onChange, getOption } = renderComponent();
      await user.click(button);

      // const options = await getOptions();

      // await user.click(options[1]);
      // expect(onChange).toHaveBeenCalledWith("processed");

      const option = await getOption(label);

      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );
  test("should call onChange with 'new' when the /new/i option is selected", async () => {
    const { button, user, onChange, getOption } = renderComponent();
    await user.click(button);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(button);
    const newOption = await getOption(/new/i);
    await user.click(newOption);
    expect(onChange).toHaveBeenCalledWith("new");
  });
});
