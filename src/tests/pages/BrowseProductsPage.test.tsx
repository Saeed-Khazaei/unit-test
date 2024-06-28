import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { test, expect, describe } from "vitest";
import BrowseProductsPage from "../../pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";
import userEvent from "@testing-library/user-event";

describe("BrowseProductsPage", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProductsPage />
      </Theme>
    );
  };
  test("should render", async () => {
    renderComponent();

    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });

  test("should show a loading skeleton when fetching categories", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: "categories-loading" })
    ).toBeInTheDocument();
  });

  test("should hide the loading skeleton after categories are fetched ", async () => {
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "categories-loading",
      })
    );
  });
  test("should show a loading skeleton when fetching products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      await screen.findByRole("progressbar", { name: "products-loading" })
    ).toBeInTheDocument();
  });

  test("should hide the loading skeleton after products are fetched ", async () => {
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "products-loading",
      })
    );
  });

  test("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "categories-loading",
      })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  test("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    waitForElementToBeRemoved(
      await screen.findByRole("progressbar", {
        name: "products-loading",
      })
    );
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });

  test("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    const options = await screen.findAllByRole("option");

    expect(options.length).toBeGreaterThan(0);
  });
});
