import { errorReducer, errorActionTypes } from "./errorReducer";

describe("errorReducer", () => {
  it("appends vis-core build metadata when setting an error without technical details", () => {
    const result = errorReducer(undefined, {
      type: errorActionTypes.SET_ERROR,
      payload: {
        title: "Configuration Error",
        message: "Unable to load page",
      },
    });

    expect(result.error.title).toBe("Configuration Error");
    expect(result.error.technicalDetails).toContain("vis-core build information");
    expect(result.error.technicalDetails).toContain("version: 0.15.0-test");
    expect(result.error.technicalDetails).toContain("commit hash: abcdef123456");
  });

  it("preserves existing technical details and appends vis-core build metadata", () => {
    const result = errorReducer(undefined, {
      type: errorActionTypes.SET_ERROR,
      payload: {
        title: "Configuration Error",
        technicalDetails: "Original technical details",
      },
    });

    expect(result.error.technicalDetails).toContain("Original technical details");
    expect(result.error.technicalDetails).toContain("vis-core build information");
    expect(result.error.technicalDetails).toContain("version: 0.15.0-test");
    expect(result.error.technicalDetails).toContain("commit hash: abcdef123456");
  });
});
