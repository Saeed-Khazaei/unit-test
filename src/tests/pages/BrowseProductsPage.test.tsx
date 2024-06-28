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
});
