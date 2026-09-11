import { normaliseStartupError } from "./normaliseStartupError";

describe("normaliseStartupError", () => {
  it("returns an access denied error for a 403 response", () => {
    const error = {
      status: 403,
      message: "Forbidden",
      url: "/swagger/v1/swagger.json",
    };

    const result = normaliseStartupError(error);

    expect(result).toMatchObject({
      title: "Access Denied",
      subtitle: "You do not have permission to access this resource",
      headerColor: "#c62828",
      showTechnicalDetails: true,
    });

    expect(result.technicalDetails).toContain("Forbidden");
    expect(result.technicalDetails).toContain(
      "/swagger/v1/swagger.json",
    );
  });

  it("returns a server error for a 500 response", () => {
    const error = {
      status: 500,
      message: "Internal server error",
      url: "/swagger/v1/swagger.json",
    };

    const result = normaliseStartupError(error);

    expect(result).toMatchObject({
      title: "Server Error",
      subtitle: "A server error occurred while loading the application",
      headerColor: "#c62828",
      showTechnicalDetails: true,
    });

    expect(result.technicalDetails).toContain(
      "Internal server error",
    );
  });

  it("returns a server error for other 5xx responses", () => {
    const error = {
      status: 503,
      message: "Service unavailable",
    };

    const result = normaliseStartupError(error);

    expect(result.title).toBe("Server Error");
    expect(result.technicalDetails).toContain(
      "Service unavailable",
    );
  });

  it("returns a general application error for other errors", () => {
    const error = new Error("Config not found");

    const result = normaliseStartupError(error);

    expect(result).toMatchObject({
      title: "Application Error",
      subtitle: "Failed to load application configuration",
      headerColor: "#d32f2f",
      showTechnicalDetails: true,
    });

    expect(result.technicalDetails).toContain("Config not found");
  });
});