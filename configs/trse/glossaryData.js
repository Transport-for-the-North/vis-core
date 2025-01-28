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
   download: {
    title:"Download",
    content: `<p>How do I view and download the results?</p>
    <p>1. Select a Combined/Local Authority within the ‘Filtering and data selection’ section, if this exists for your current visual.</p>
    <p>2. Select a Combined/Local Authority within the ‘Download data’ section, if this option exists for your current visual.</p>
    <p>3. Under ‘Select output areas’, you can either enter your output area code, if known, or make use of the selector tool by clicking ‘Enable Selector’ and using either ‘Pointer Select’ to select individual OA areas or ‘Rectangle Select’ to highlight a selection of OA areas to include. You can see them compile in the box. Simply re-click on the OA on the map to remove or click on the ‘x’ next to the name in the box. To remove them all, click on the larger ‘X’ to the right of the box.
    Note: Leaving this box empty will allow you to download all the OA data within the chosen Combined/Local Authority.</p>
    <p>4. Tick ‘Include public transport stops’ if you would like this information within the selected Output areas included also.</p>
    <p>Click ‘download’. Doing this will create a downloaded excel document in the top right which will save in your downloads folder on your computer. Once downloaded, you can use the excel functions such as ‘filter and ‘autosum’ to support your calculations.</p>`,
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
  