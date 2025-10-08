import { FixedExternalIcon } from "Components/Navbar/FixedExternalIcon";
import { render, screen } from "@testing-library/react";

describe("FixedExternalIcon component test", () => {
    it("Test the render of the icon", () => {
        render(<FixedExternalIcon data-testid="external-icon" />);
        const element = screen.getByTestId("external-icon");
        expect(element).toHaveStyle("height: 16px")
        expect(element).toHaveStyle("width: 16px")
        expect(element).toHaveStyle("margin-left: 0px")
        expect(element).toHaveStyle("flex-shrink: 0")
    });
});