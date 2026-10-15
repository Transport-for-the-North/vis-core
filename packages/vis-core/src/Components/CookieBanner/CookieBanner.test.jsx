import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import { AppContext } from "contexts/AppContext";
import { CookieBanner } from "./CookieBanner";

jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe("CookieBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.clarity = jest.fn();
  });

  it("shows banner with approved wording when no consent exists", () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AppContext.Provider value={{ footer: { cookiesLink: "https://example.com/cookies" } }}>
        <CookieBanner />
      </AppContext.Provider>
    );

    expect(screen.getByLabelText("Cookie consent")).toBeInTheDocument();
    expect(screen.getByText(/We use essential cookies to make this tool work/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cookie policy/i })).toHaveAttribute("href", "https://www.transportforthenorth.com/cookies-policy");
    expect(window.clarity).toHaveBeenCalledWith("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
  });

  it("accept saves analytics consent and grants Clarity consent", async () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Accept analytics cookies" }));

    expect(Cookies.set).toHaveBeenCalledWith(
      "analyticsConsent",
      "accepted",
      expect.objectContaining({ path: "/", sameSite: "Lax" })
    );
    expect(window.clarity).toHaveBeenLastCalledWith("consentv2", {
      ad_Storage: "granted",
      analytics_Storage: "granted",
    });
    expect(screen.queryByLabelText("Cookie consent")).not.toBeInTheDocument();
  });

  it("reject saves analytics consent and keeps Clarity denied", async () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Reject analytics cookies" }));

    expect(Cookies.set).toHaveBeenCalledWith(
      "analyticsConsent",
      "rejected",
      expect.objectContaining({ path: "/", sameSite: "Lax" })
    );
    expect(window.clarity).toHaveBeenLastCalledWith("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
  });

  it("stays hidden when preference is already stored", () => {
    Cookies.get.mockReturnValue("accepted");

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    expect(screen.queryByLabelText("Cookie consent")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Change cookie preferences" })).not.toBeInTheDocument();
  });
});
