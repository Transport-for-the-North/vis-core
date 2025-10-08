import { ScrollableContainer } from "Components/ScrollableContainer";
import { render, screen } from "@testing-library/react";
import { CARD_CONSTANTS } from 'defaults';
const { PADDING } = CARD_CONSTANTS

describe("ScrollableContainer component test", () => {
    it("Basic use", () => {
        render(<ScrollableContainer children={<div>ImHere</div>}/>);
        const element = screen.getByText("ImHere")
        expect(element).toBeInTheDocument();
        const container = screen.getByTestId("container");
        expect(container).toHaveStyle(`padding: ${PADDING}px;`);
    });
});