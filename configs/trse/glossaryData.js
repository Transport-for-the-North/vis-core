const glossaryData = {
    /*
    Add new Info (mini-manual) entries within infoFragments, eg:
    "key_unique_underscored": {
      title: "Title for display",
      content: `<p>Text content in basic HTML.</p>`,
    },
    Title is searched, so be descriptive, both spelling out and bracketing title's acronyms.
    Duplicate entries can be hacked in under different names by adding this below infoFragments, eg:
    infoFragments.new_key = { title: "New title", content: infoFragments[old_key].content}
    */
   access: {
    title:"Access",
    content: `<p>The ability to reach everyday places with the transport options available. This includes, shops and basic services, work, education, and healthcare.</p>`,
   },
   ca: {
    title:"CA",
    content: `<p>Combined Authorities bring together multiple local authorities to share responsibilities. Some but not all have elected Mayors.</p>`,
   },
   factor_analysis: {
    title:"Factor Analysis",
    content: `<p>A statistical process for grouping data and identifying the relative significance of different variables.</p>`,
   },
   lad: {
    title:"LAD",
    content: `<p>Local Authority Districts is a collective term for the approximately 300 local government bodies in England.</p>`,
   },
   output_area: {
    title:"Output Area",
    content: `<p>A small area, with an average population of 300, based on the 2021 Census.</p>`,
   },
   risk: {
    title:"Risk",
    content: `<p>How likely it is that people in an area are affected by TRSE, compared to the rest of the local or combined authority, or to England as a whole.</p>`,
   },
   stb: {
    title:"STB",
    content: `<p>Sub-national transport bodies provide strategic direction and advice on the transport needs of the regions of England.</p>`,
   },
   stp: {
    title:"STP",
    content: `<p>The Strategic Transport Plan is TfN's strategy for economic transformation, decarbonisation, and social inclusion in the North of England.</p>`,
   },
   tfn: {
    title:"TfN",
    content: `<p>Transport for the North is the sub-national transport body for the North of England.</p>`,
   },
   trse: {
    title:"TRSE",
    content: `<p>Transport-related social exclusion means that transport issues have a fundamental impact on everyday life, and limit the ability to fulfil everyday needs.</p>`,
   },
   vulnerability: {
    title:"Vulnerability",
    content: `<p>The set of factors that make social exclusion more likely, such as poverty, disability, poor health, and caring responsibilities. </p>`,
   },
  };
  
  function getInfo(key) {
    return glossaryData?.[key] ?? null;
  }
  
  function getInfoOptions(location) {
    const options = Object.keys(glossaryData).map((key) => ({
      value: key,
      text: glossaryData[key].title,
      exclude: glossaryData[key].exclude,
    }));
    options.sort((a, b) => (a.text > b.text ? 1 : -1));
    return options.filter(
      (option) => !glossaryData[option.value].exclude?.includes(location)
    );
  }
  
  export default glossaryData;
  