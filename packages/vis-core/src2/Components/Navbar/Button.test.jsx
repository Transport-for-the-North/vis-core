import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "Components/Navbar/Button";

describe("Navbar Button", () => {
  it("Launches the onClick function passed in the props when clicked", () => {
    const handleClick = jest.fn();
    render(
      <Button
        onClick={handleClick}
        src="/fake.png"
        alt="bouton"
      />
    );
    const button = screen.getByTestId("custom-button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
