import { IFrameEmbedPage } from "Components/IFrameEmbedPage";
import { render, screen } from "@testing-library/react";

describe("IFrameEmbedPage test", () => {
  it("No config or config.url provided", () => {
    const { container } = render(<IFrameEmbedPage config={{}} />);
    expect(container.textContent).toBe("No URL provided for embedding.");
  });

  it("StyledIFrame with url source", () => {
    render(<IFrameEmbedPage config={{ url: "https://im.a.good.url" }} />);
    const iframeElement = screen.getByTitle("Embedded Content");
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute("src", "https://im.a.good.url");
    expect(iframeElement).toHaveAttribute("allowFullScreen");
    expect(iframeElement).toHaveStyle("width: 100%");
    expect(iframeElement).toHaveStyle("height: 100%");
    expect(iframeElement).toHaveStyle("border: none");
  });
});
