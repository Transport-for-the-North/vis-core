const appNames = ['bsip', 'noham', 'norms']

export const appConfig = {
  title: "TAME React Vis Template",
  introduction: `<p>HTML, or HyperText Markup Language, is the standard markup language used to create web pages. It provides the structure of a webpage, allowing for the insertion of text, images, and other multimedia elements. HTML is not a programming language; it is a markup language that defines the content of web pages.</p>
    <p>HTML documents are made up of elements. These elements are represented by tags, which label pieces of content such as "heading", "paragraph", "list", and so on. Browsers do not display the HTML tags but use them to render the content of the page.</p>
    <h2>Basic HTML Page Structure</h2>
    <p>An HTML document has a defined structure that includes the following main elements:</p>
    <ul>
        <li><strong>DOCTYPE declaration:</strong> Defines the document type and version of HTML.</li>
        <li><strong>html element:</strong> This is the root element that encloses all the content of an HTML document.</li>
        <li><strong>head element:</strong> Contains meta-information about the document, such as its title and links to scripts and stylesheets.</li>
        <li><strong>body element:</strong> Contains the content of the document, such as text, images, and other media.</li>
    </ul>
    <p>Learning HTML is the first step in creating web content and is essential for web developers. It is easy to learn and can be combined with CSS (Cascading Style Sheets) and JavaScript to create interactive and styled web pages.</p>`,
  background: "",
  methodology: "",
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  contactText: "Please contact [Name] for any questions on this data tool.",
  contactEmail: "firstname.lastname@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/hero-image.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  appPages: [
  ],
};

// Function to dynamically import appConfigs and combine their appPages
async function loadAppConfigs() {
  const appPages = [];

  for (const appName of appNames) {
    try {
      const appConfigModule = await import(`../${appName}/appConfig.js`);
      if (appConfigModule.appConfig && appConfigModule.appConfig.appPages) {
        appPages.push(...appConfigModule.appConfig.appPages);
      }
    } catch (error) {
      console.error(`Failed to load appConfig for ${appName}:`, error);
    }
  }

  appConfig.appPages = appPages;
}

// Load the appConfigs and combine their appPages
loadAppConfigs();