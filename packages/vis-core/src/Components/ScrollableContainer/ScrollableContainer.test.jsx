import { ScrollableContainer } from "Components/ScrollableContainer";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    it("shows an updated-card hint and clears it when clicked", async () => {
        const user = userEvent.setup();
        const onUpdatedCardsClicked = jest.fn();
        const toggle = jest.fn();
        const originalRequestAnimationFrame = global.requestAnimationFrame;
        const originalScrollTo = HTMLElement.prototype.scrollTo;

        global.requestAnimationFrame = (callback) => {
            callback();
            return 1;
        };
        HTMLElement.prototype.scrollTo = jest.fn();

        render(
            <ScrollableContainer
                updatedCardNames={new Set(["card-a"])}
                onUpdatedCardsClicked={onUpdatedCardsClicked}
            >
                <div data-callout-card-name="card-a" data-callout-card-open="false">
                    <button data-callout-card-toggle onClick={toggle}>Toggle card</button>
                    Card A
                </div>
            </ScrollableContainer>
        );

        await user.click(screen.getByRole("button", { name: /1 card updated/i }));

        expect(toggle).toHaveBeenCalledTimes(1);
        expect(onUpdatedCardsClicked).toHaveBeenCalledWith("card-a");

        global.requestAnimationFrame = originalRequestAnimationFrame;
        HTMLElement.prototype.scrollTo = originalScrollTo;
    });

    it("marks an open visible updated card as seen after the timeout", () => {
        jest.useFakeTimers();
        const onUpdatedCardSeen = jest.fn();
        const rectSpy = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
            top: 0,
            bottom: 20,
            left: 0,
            right: 20,
            width: 20,
            height: 20,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        render(
            <ScrollableContainer
                updatedCardNames={["card-a"]}
                onUpdatedCardSeen={onUpdatedCardSeen}
            >
                <div data-callout-card-name="card-a" data-callout-card-open="true">Card A</div>
            </ScrollableContainer>
        );

        act(() => {
            jest.advanceTimersByTime(2800);
        });

        expect(onUpdatedCardSeen).toHaveBeenCalledWith("card-a");

        rectSpy.mockRestore();
        jest.useRealTimers();
    });
});
