import { render, screen, act, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "./ToastContext";
import React from 'react';

// A mock consumer component to trigger toast methods
const ToastConsumer = () => {
  const { addToast, removeToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          addToast({ id: "test-toast-1", message: "Hello Toast", duration: 0 })
        }
      >
        Add Toast
      </button>
      <button onClick={() => removeToast("test-toast-1")}>
        Remove Toast
      </button>
      <button
        onClick={() =>
          addToast({ id: "timed-toast", message: "Timed", duration: 1000 })
        }
      >
        Add Timed Toast
      </button>
    </div>
  );
};

describe("ToastContext tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("safely falls back if ToastProvider is missing", () => {
    const MissingProviderConsumer = () => {
      const { addToast } = useToast();
      return (
        <button onClick={() => addToast({ message: "Should not crash" })}>
          Click me
        </button>
      );
    };

    render(<MissingProviderConsumer />);
    // Should not throw when clicking
    fireEvent.click(screen.getByText("Click me"));
  });

  it("renders children correctly", () => {
    render(
      <ToastProvider>
        <p>I am a child</p>
      </ToastProvider>
    );
    expect(screen.getByText("I am a child")).toBeInTheDocument();
  });

  it("adds and removes toasts manually", () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    // Initial state: no toast
    expect(screen.queryByText("Hello Toast")).not.toBeInTheDocument();

    // Add toast
    fireEvent.click(screen.getByText("Add Toast"));
    expect(screen.getByText("Hello Toast")).toBeInTheDocument();

    // Remove toast
    fireEvent.click(screen.getByText("Remove Toast"));
    expect(screen.queryByText("Hello Toast")).not.toBeInTheDocument();
  });

  it("automatically removes timed toasts", () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    // Add timed toast
    fireEvent.click(screen.getByText("Add Timed Toast"));
    expect(screen.getByText("Timed")).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Toast should be gone
    expect(screen.queryByText("Timed")).not.toBeInTheDocument();
  });
  
  it("allows removing a toast via the close button", () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    );

    // Add toast
    fireEvent.click(screen.getByText("Add Toast"));
    expect(screen.getByText("Hello Toast")).toBeInTheDocument();

    // Find and click the close button (rendered as &times; which is '×')
    const closeBtn = screen.getByText("×");
    fireEvent.click(closeBtn);

    // Toast should be gone
    expect(screen.queryByText("Hello Toast")).not.toBeInTheDocument();
  });
});
