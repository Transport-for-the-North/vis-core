import { act, render, screen } from "@testing-library/react";
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

  it("uses AppContext cookie policy link when provided", () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AppContext.Provider value={{ footer: { cookiesLink: "https://example.com/cookies" } }}>
        <CookieBanner />
      </AppContext.Provider>
    );

    expect(screen.getByLabelText("Cookie consent")).toBeInTheDocument();
    expect(screen.getByText(/We use essential cookies to make this tool work/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cookie policy/i })).toHaveAttribute("href", "https://example.com/cookies");
    expect(window.clarity).toHaveBeenCalledWith("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
  });

  it("falls back to default cookie policy URL when AppContext link is missing", () => {
    Cookies.get.mockReturnValue(undefined);

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    expect(screen.getByRole("link", { name: /cookie policy/i })).toHaveAttribute("href", "https://www.transportforthenorth.com/cookies-policy");
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
  });

  it("reopens preferences and allows changing consent from accepted to rejected", async () => {
    Cookies.get.mockReturnValue("accepted");

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    act(() => {
      window.dispatchEvent(new Event("vis:open-cookie-preferences"));
    });
    expect(await screen.findByLabelText("Cookie consent")).toBeInTheDocument();

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

  it("reopens preferences via event and allows changing consent from rejected to accepted", async () => {
    Cookies.get.mockReturnValue("rejected");

    render(
      <AppContext.Provider value={{}}>
        <CookieBanner />
      </AppContext.Provider>
    );

    act(() => {
      window.dispatchEvent(new Event("vis:open-cookie-preferences"));
    });
    expect(await screen.findByLabelText("Cookie consent")).toBeInTheDocument();

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
  });
});
