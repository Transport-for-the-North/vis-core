import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";
import userEvent from "@testing-library/user-event";

const fakeOnClick = jest.fn();
describe("Logo Component", () => {
    it("renders correctly with image and left position", () => {
        render(<Logo onClick={fakeOnClick} logoImage="logo.png" position="left" />);
        const img = screen.getByAltText("Logo");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "logo.png");
        userEvent.click(img);
        expect(fakeOnClick).toHaveBeenCalled();
    });
});