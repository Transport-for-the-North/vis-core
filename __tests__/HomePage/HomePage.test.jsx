import { HomePage } from "Components/HomePage";
import { Footer } from "Components/HomePage/Footer";
import {
  MAX_IMAGE_HEIGHT,
  WIDTH_BREAKPOINT,
  MAX_IMAGES_ALLOWED,
} from "Components/HomePage/constants";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  interweaveContentWithImages,
  createBlockSections,
  replacePlaceholders,
  processFragmentContent,
} from "Components/HomePage/helpers";
import { baseService } from "services/api/Base";
import { AppContext } from "contexts";

jest.mock("services/api/Base", () => {
  const mockMethods = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  class MockBaseService {}
  Object.assign(MockBaseService.prototype, mockMethods);

  return {
    __esModule: true,
    default: MockBaseService,
    BaseService: MockBaseService,
    baseService: { ...mockMethods },
  };
});

// Mock de l'objet api global (si nécessaire)
global.api = {
  baseService: baseService,
};

const linkRouter = () => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <Footer
              creditsText="Im a credits text"
              privacyPolicyLink="/privacyPolicyLink"
              cookiesLink="/cookiesLink"
              contactUsLink="/contactUsLink"
            />
          }
        />
        <Route
          path="/privacyPolicyLink"
          element={<div>Privacy Policy Page</div>}
        />
        <Route path="/cookiesLink" element={<div>Cookies Page</div>} />
        <Route path="/contactUsLink" element={<div>Contact Us Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("HomePage test", () => {
  describe("constants tests", () => {
    it("constants tests", () => {
      expect(MAX_IMAGE_HEIGHT).toBe(300);
      expect(WIDTH_BREAKPOINT).toBe(1000);
      expect(MAX_IMAGES_ALLOWED).toBe(4);
    });
  });

  describe("Footer test", () => {
    it("navigue vers Cookies", async () => {
      linkRouter();
      const cookie = screen.getByText("Cookies");
      userEvent.click(cookie);
      expect(screen.getByText("Cookies Page")).toBeInTheDocument();
    });

    it("navigue vers Privacy Policy", async () => {
      linkRouter();
      const privacy_policy = screen.getByText("Privacy Policy");
      userEvent.click(privacy_policy);
      expect(screen.getByText("Privacy Policy Page")).toBeInTheDocument();
    });

    it("navigue vers Contact Us", async () => {
      linkRouter();
      const contact_us = screen.getByText("Contact Us");
      userEvent.click(contact_us);
      expect(screen.getByText("Contact Us Page")).toBeInTheDocument();
    });
  });

  describe("helper tests", () => {
    const htmlContent = `<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p><p>Paragraph 4</p>`;
    const images = [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ];
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("interweaveContentWithImages basic test", () => {
      const result = interweaveContentWithImages(htmlContent, images);
      // Should produce 5 elements: 4 paragraphs and 2 images interleaved
      expect(result.length).toBe(6);
      expect(result[0].key).toBe("child-0");
      expect(result[1].key).toBe("child-1");
      expect(result[2].key).toBe("img-0");
      expect(result[3].key).toBe("child-2");
      expect(result[4].key).toBe("child-3");
      expect(result[5].key).toBe("img-1");
    });
    it("createBlockSections basic test", () => {
      const result = createBlockSections(htmlContent, images);
      expect(result.length).toBe(3);
      expect(result).toEqual([
        {
          textSegment: expect.any(Array),
          image: "https://example.com/image1.jpg",
        },
        {
          textSegment: expect.any(Array),
          image: "https://example.com/image2.jpg",
        },
        {
          textSegment: [],
          image: null,
        },
      ]);
    });
    it("replacePlaceholders basic test", () => {
      const content = `<p>Hello <span data-placeholder="name">{{name}}</span>!</p>`;
      const replacements = {
        name: "John",
      };
      const result = replacePlaceholders(content, replacements);
      expect(result).toBe(
        `<p>Hello <span data-placeholder="name">John</span>!</p>`
      );
    });
    describe("processFragmentContent", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should process fragment content with baseService API call", async () => {
        const mockApiResponse = {
          name: "John Doe",
          age: 30,
          email: "john@test.com",
        };

        baseService.get.mockResolvedValue(mockApiResponse);

        const fragment = {
          apiConfig: {
            url: "/api/imAnUrl",
            mapping: {
              userName: "name",
              userAge: "age",
            },
          },
        };
        const content = `
      <p>Name: <span data-placeholder="userName">{{userName}}</span></p>
      <p>Age: <span data-placeholder="userAge">{{userAge}}</span></p>
    `;

        const result = await processFragmentContent(fragment, content);

        expect(baseService.get).toHaveBeenCalledWith("/api/imAnUrl");
        expect(baseService.get).toHaveBeenCalledTimes(1);

        expect(result).toContain(
          '<span data-placeholder="userName">John Doe</span>'
        );
        expect(result).toContain('<span data-placeholder="userAge">30</span>');

        const expectedResult = `
      <p>Name: <span data-placeholder="userName">John Doe</span></p>
      <p>Age: <span data-placeholder="userAge">30</span></p>
    `;
        expect(result.trim()).toBe(expectedResult.trim());
      });

      it("should handle API errors gracefully", async () => {
        // Mock API error
        const apiError = new Error("API is down");
        baseService.get.mockRejectedValue(apiError);

        const fragment = {
          apiConfig: {
            url: "/api/failing-endpoint",
            mapping: {
              userName: "name",
            },
          },
        };

        const content = `<p>Name: <span data-placeholder="userName">{{userName}}</span></p>`;

        // Spy on console.error to check for errors
        const consoleSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {});

        const result = await processFragmentContent(fragment, content);

        expect(result).toBe(content);
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to fetch API data for placeholders:",
          apiError
        );

        consoleSpy.mockRestore();
      });

      it("should return original content when no apiConfig", async () => {
        const fragment = {}; // missing apiConfig
        const content = `<p>Static content without placeholders</p>`;

        const result = await processFragmentContent(fragment, content);

        expect(result).toBe(content);
        expect(baseService.get).not.toHaveBeenCalled();
      });

      it("should return original content when apiConfig is incomplete", async () => {
        const fragmentWithoutUrl = {
          apiConfig: {
            // missing url
            mapping: {
              userName: "name",
            },
          },
        };

        const fragmentWithoutMapping = {
          apiConfig: {
            url: "/api/test",
            // missing mapping
          },
        };

        const content = `<p>Test content</p>`;

        // Test without URL
        const result1 = await processFragmentContent(
          fragmentWithoutUrl,
          content
        );
        expect(result1).toBe(content);

        // Test without mapping
        const result2 = await processFragmentContent(
          fragmentWithoutMapping,
          content
        );
        expect(result2).toBe(content);

        expect(baseService.get).not.toHaveBeenCalled();
      });

      it("should handle multiple placeholders correctly", async () => {
        const mockApiResponse = {
          firstName: "John",
          lastName: "Doe",
          age: 30,
          city: "New York",
          country: "USA",
        };

        baseService.get.mockResolvedValue(mockApiResponse);

        const fragment = {
          apiConfig: {
            url: "/api/user/profile",
            mapping: {
              userFirstName: "firstName",
              userLastName: "lastName",
              userAge: "age",
              userCity: "city",
            },
          },
        };

        const content = `
      <div>
        <p>Hello <span data-placeholder="userFirstName">{{userFirstName}}</span> <span data-placeholder="userLastName">{{userLastName}}</span>!</p>
        <p>You are <span data-placeholder="userAge">{{userAge}}</span> years old.</p>
        <p>You live in <span data-placeholder="userCity">{{userCity}}</span>.</p>
      </div>
    `;
        const result = await processFragmentContent(fragment, content);
        expect(result).toContain(
          '<span data-placeholder="userFirstName">John</span>'
        );
        expect(result).toContain(
          '<span data-placeholder="userLastName">Doe</span>'
        );
        expect(result).toContain('<span data-placeholder="userAge">30</span>');
        expect(result).toContain(
          '<span data-placeholder="userCity">New York</span>'
        );
      });

      it("should handle missing data keys gracefully", async () => {
        const mockApiResponse = {
          name: "John Doe",
        };
        baseService.get.mockResolvedValue(mockApiResponse);
        const fragment = {
          apiConfig: {
            url: "/api/user/123",
            mapping: {
              userName: "name",
              userAge: "age",
            },
          },
        };

        const content = `
      <p>Name: <span data-placeholder="userName">{{userName}}</span></p>
      <p>Age: <span data-placeholder="userAge">{{userAge}}</span></p>
    `;
        const result = await processFragmentContent(fragment, content);
        expect(result).toContain(
          '<span data-placeholder="userName">John Doe</span>'
        );
        expect(result).toContain(
          '<span data-placeholder="userAge">undefined</span>'
        );
      });

      it("should use fetch for external URLs", async () => {
        const mockApiResponse = {
          username: "external_user",
          id: 1,
        };
        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockApiResponse),
        });

        const fragment = {
          apiConfig: {
            url: "https://jsonplaceholder.typicode.com/users/1",
            mapping: {
              userName: "username",
            },
          },
        };

        const content = `<p>User: <span data-placeholder="userName">{{userName}}</span></p>`;
        const result = await processFragmentContent(fragment, content);
        expect(fetch).toHaveBeenCalledWith(
          "https://jsonplaceholder.typicode.com/users/1",
          {
            method: "GET",
          }
        );
        expect(baseService.get).not.toHaveBeenCalled();
        expect(result).toContain(
          '<span data-placeholder="userName">external_user</span>'
        );
        global.fetch.mockRestore();
      });
    });
  });

  describe("HomePage test", () => {
    const mockAppContexte = {
      //   state: {
      footer: {
        creditsText: "Im a credits text",
        privacyPolicyLink: "/privacyPolicyLink",
        cookiesLink: "/cookiesLink",
        contactUsLink: "/contactUsLink",
      },
      homePageFragments: [
        {
          id: 1,
          htmlContent: `<p>Fragment 1 content</p>`,
          images: ["https://example1.1", "https://example1.2"],
          content: "foo",
          apiConfig: null,
          sectionTitle: "sectionTitle1",
          alignment: "alignment"
        },
        {
          id: 2,
          htmlContent: `<p>Fragment 2 content with image</p>`,
          content: "bar",
          images: ["https://example2.1"],
          apiConfig: null,
          sectionTitle: "sectionTitle2"
        },
      ],
      //   },
      background: "background",
      methodology: "methodology",
      additionalImage: "additionalImage",
      title: "My App Title",
      backgroundImage: "backgroundImage",
      introduction: "introduction",
      contactText: "contactText",
      contactEmail: "contactEmail",
      legalText: "legalText"
    };
    it("test", async () => {
      render(
        <MemoryRouter>
          <AppContext.Provider value={mockAppContexte}>
            <HomePage />
          </AppContext.Provider>
        </MemoryRouter>
      );

        // Title
        expect(screen.getByText("My App Title")).toBeInTheDocument();
        // Background img Header
        const divElement = screen.getByTestId('background-img');
        expect(divElement).toHaveStyle('backgroundImage: url(backgroundImage)');
        // Introduction
        expect(screen.getByText("introduction")).toBeInTheDocument();
        // Fixed Sections
        expect(screen.getByText("Background")).toBeInTheDocument();
        expect(screen.getByText("Methodology")).toBeInTheDocument();
        expect(screen.getByAltText("Additional Image")).toBeInTheDocument();
        // Additional Fragments
        // Need to await because the setFragmentsContent method im the component is Async
        const fragment1Title = await screen.findByText("sectionTitle1");
        const fragment2Title = await screen.findByText("sectionTitle2");
        expect(fragment1Title).toBeInTheDocument();
        expect(fragment2Title).toBeInTheDocument();
        // Test dynamic class
        expect(fragment1Title).toHaveClass("title-alignment");
        expect(fragment2Title).toHaveClass("title-center");
        // img source
        const images = screen.getAllByAltText(/Image/i);
        expect(images[1]).toHaveAttribute("src", "https://example1.1");
        expect(images[2]).toHaveAttribute("src", "https://example1.2");
        expect(images[0]).toHaveAttribute("src", "additionalImage");
        const images2 = screen.getAllByAltText(/ image/i);
        expect(images2[0]).toHaveAttribute("src", "additionalImage");
        // contactText
        expect(screen.getByText("contactText")).toBeInTheDocument();
        const contactEmail = screen.getByText("Email: contactEmail")
        expect(contactEmail).toBeInTheDocument();
        expect(contactEmail).toHaveAttribute("href", "mailto:contactEmail");
        // legal section
        expect(screen.getByText("legalText")).toBeInTheDocument();
        // footer
        // go see the footer test
    });
  });
});
