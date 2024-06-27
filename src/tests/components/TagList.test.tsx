import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import TagList from "../../components/TagList";

describe("TagList", () => {
  test("should render", async () => {
    render(<TagList />);

    expect(screen.getByRole("list")).toBeInTheDocument();

    // NOTE:The first way
    // await waitFor(() => { // it will wait for 500ms
    //   const listItems = screen.getAllByRole("listitem");
    //   expect(listItems.length).toBeGreaterThan(0);
    // });

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
