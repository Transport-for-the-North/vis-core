import {
  registerMapRestorer,
  unregisterMapRestorer,
  restoreMapRuntimeState,
} from "./runtimeRestorationRegistry";

describe("runtimeRestorationRegistry", () => {
  let mapA;
  let mapB;

  beforeEach(() => {
    jest.useFakeTimers();
    mapA = {};
    mapB = {};
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("registers restorers by map and key, and replaces duplicate keys", async () => {
    const initialFn = jest.fn().mockReturnValue(true);
    const replacementFn = jest.fn().mockReturnValue(true);

    registerMapRestorer(mapA, "key1", initialFn);
    registerMapRestorer(mapA, "key1", replacementFn);

    const promise = restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });
    await promise;

    expect(initialFn).not.toHaveBeenCalled();
    expect(replacementFn).toHaveBeenCalledTimes(1);
  });

  it("keeps maps independent from one another", async () => {
    const fnA = jest.fn().mockReturnValue(true);
    const fnB = jest.fn().mockReturnValue(true);

    registerMapRestorer(mapA, "feature-state", fnA);
    registerMapRestorer(mapB, "feature-state", fnB);

    await restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });

    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).not.toHaveBeenCalled();
  });

  it("does not retry restorers that succeed", async () => {
    const fn = jest.fn().mockReturnValue(true);
    registerMapRestorer(mapA, "key1", fn);

    await restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries failed restorers up to maximum bounded attempts", async () => {
    let callCount = 0;
    const failingFn = jest.fn(() => {
      callCount++;
      return false;
    });

    registerMapRestorer(mapA, "flaky", failingFn);

    const promise = restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });

    // Advance through 10 retry delays
    for (let i = 0; i < 10; i++) {
      await jest.advanceTimersByTimeAsync(200);
    }
    await promise;

    expect(failingFn).toHaveBeenCalledTimes(10);
  });

  it("stops retrying once failing restorer succeeds", async () => {
    let attempts = 0;
    const eventuallySucceeds = jest.fn(() => {
      attempts++;
      return attempts >= 3;
    });

    registerMapRestorer(mapA, "delayed", eventuallySucceeds);

    const promise = restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });

    await jest.advanceTimersByTimeAsync(200);
    await jest.advanceTimersByTimeAsync(200);
    await promise;

    expect(eventuallySucceeds).toHaveBeenCalledTimes(3);
  });

  it("aborts execution and retries when cancelled", async () => {
    let isCancelled = false;
    const fn = jest.fn(() => false);
    registerMapRestorer(mapA, "key", fn);

    const promise = restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => isCancelled,
    });

    isCancelled = true;
    await jest.advanceTimersByTimeAsync(200);
    await promise;

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("prevents execution when unregistered via cleanup function", async () => {
    const fn = jest.fn().mockReturnValue(true);
    const unregister = registerMapRestorer(mapA, "key1", fn);

    unregister();

    await restoreMapRuntimeState({
      map: mapA,
      isCancelled: () => false,
    });

    expect(fn).not.toHaveBeenCalled();
  });
});
