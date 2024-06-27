import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ProductImageGallery from "../../components/ProductImageGallery";

describe("ProductImageGallery", () => {
  test("should render nothing if image urls is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />); // When container returns null we should use this pattern

    expect(container).toBeEmptyDOMElement();
  });
  test("should render a list of images", () => {
    const imageUrls = ["test1.png", "test2.png", "test3.png"];
    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(images.length);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
