# Toast Notification System

The `vis-core` library provides a robust, application-level notification system for rendering "toast" messages. These toasts appear at the bottom centre of the viewport and gracefully slide into view. They are built to provide crucial feedback to the user without interrupting their workflow.

## Overview

The system consists of two primary parts:
1. **`ToastProvider`**: A context provider that manages the state of the active toast messages and renders the global `ToastContainer`.
2. **`useToast`**: A React hook that exposes methods for dispatching (`addToast`) and manually clearing (`removeToast`) notifications.

### Global Integration

The `ToastProvider` is deeply integrated within `vis-core`. 
It is already wrapped around the core `MapLayout` and `AppContextProvider`. This means that if a host application leverages standard `vis-core` layouts, the notification pipeline is automatically active—no additional configuration is required.

In the rare event that a host application is entirely custom and does not utilise `AppContext` or `MapLayout`, developers can manually import and mount the `ToastProvider` at the root of their component tree. Furthermore, if `useToast` is invoked in an environment where the provider is missing, it will safely fall back to dummy functions, ensuring the application does not crash.

---

## Implementing Toasts in Components

To trigger a toast notification from any child component within the `vis-core` ecosystem, simply import and consume the `useToast` hook.

### Example Usage

```javascript
import React from 'react';
import { useToast } from 'contexts';

export const ExampleComponent = () => {
  const { addToast, removeToast } = useToast();

  const handleAction = () => {
    // 1. Dispatch a timed success message
    addToast({
      id: 'success-action', 
      type: 'info', 
      message: 'Data successfully loaded!', 
      duration: 3000 // Disappears after 3 seconds
    });
  };

  const handleCriticalError = () => {
    // 2. Dispatch a persistent error message
    addToast({
      id: 'critical-error',
      type: 'error',
      message: 'Network disconnected. Please refresh the page.',
      duration: 0 // Remains fixed until manually dismissed
    });
  };

  return (
    <button onClick={handleAction}>Load Data</button>
  );
};
```

---

## Configuration Options

When invoking `addToast(config)`, the configuration object accepts the following properties:

| Property   | Type      | Default  | Description |
|------------|-----------|----------|-------------|
| `id`       | `string`  | `Date.now()` | A unique identifier for the toast. Providing a custom ID prevents duplicate identical toasts from stacking. |
| `message`  | `string`  | Required | The text content of the notification. |
| `type`     | `string`  | `'info'` | Determines the visual styling (colour scheme). Accepted values are `'info'`, `'warning'`, and `'error'`. |
| `duration` | `number`  | `0`      | The time in milliseconds before the toast automatically dismisses. If set to greater than `0`, an animated progress bar will appear. A value of `0` means the toast is fixed until the user explicitly clears it. |

## Clearing Toasts Programmatically

You can dismiss a specific toast programmatically using the `removeToast` method. This is particularly useful for clearing "loading" or "waiting" notifications once an asynchronous task completes.

```javascript
import { useEffect } from 'react';
import { useToast } from 'contexts';

export const DataFetcher = ({ isFetching, hasError }) => {
  const { addToast, removeToast } = useToast();

  useEffect(() => {
    if (isFetching) {
      addToast({
        id: 'fetching-toast',
        type: 'info',
        message: 'Fetching latest scenarios...',
        duration: 0 
      });
    } else {
      // Clear the message when fetching finishes
      removeToast('fetching-toast');
    }
    
    if (hasError) {
      addToast({
        type: 'error',
        message: 'Failed to retrieve scenarios.',
        duration: 5000 
      });
    }
  }, [isFetching, hasError, addToast, removeToast]);
  
  return null;
};
```

## Styling and Behaviour

The toast elements are styled via `styled-components` within `ToastContext.jsx`. By default:
- They appear at `bottom: 20px`.
- Timed toasts (`duration > 0`) feature an animated progress bar at the bottom edge.
- They are constrained to a maximum width of `90vw` for excellent mobile responsiveness.
- The wrapper restricts `pointer-events: none` so that the toasts do not interfere with underlying map interactions, while the individual toast bodies reinstate `pointer-events: auto` to allow for manual dismissal.
