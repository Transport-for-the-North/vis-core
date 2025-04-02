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
   active_travel: {
    title: "Active travel",
    content: `<p>Active travel refers to modes of transportation that involve physical activity, such as <b>walking, cycling, wheeling</b>, and <b>scootering.</b> This form of travel promotes <b>health benefits, reduces carbon emissions</b>, and can <b>improve air quality</b> and <b>road safety.</b>`
   },
   affected_area: {
    title: "Affected area types",
    content: `<p>In our study of severance based on the SRN, MRN, and rail network, we identified <b>5 affected area types.</b>
    <p>The below area types <b>experience severance to varying extents</b> due to the SRN, MRN, or rail network when walking to select, key services.
    <ol><b><li>Lowest affected area type</li> <li>Moderately affected area type</li> <li>Severely affected area type </li></b></ol>
    <p>The remaining two types are areas which are not impacted by severance in our defined parameters. Instead, these are areas which show OAs which either have a perfect 10-minute walkable reach to all select, key destinations or have no perfect 10-minute walkable reach to select, key destinations.
    <ol start="4"><b><li>Perfect access areas</li> <li>No access areas</li></b></ol>`
   },
   barrier: {
    title: "Barrier types",
    content: `<p>Barrier types in our study of severance refers to the three infrastructure types we are exploring as barriers to walking: <b>the strategic road network, the major road network</b>, and <b>the rail network.</b>`
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
   isochrone: {
    title: "Isochrone",
    content: `<p>An isochrone is a line on a map that <b>connects points</b> where an event occurs simultaneously or <b>within the same time frame.</b>
    <p>Isochrone maps are often used to <b>show areas that can be reached from a specific point</b> within a <b>certain amount of time.</b>`
   },
   lad: {
    title:"LAD",
    content: `<p>Local Authority Districts is a collective term for the approximately 300 local government bodies in England.</p>`,
   },
   lowest_areas: {
    title: "Lowest affected area types",
    content: `<p>An area which has been identified as having SRN, MRN, and/or rail network infrastructure which restricts walkable access to select, key destination(s).
    <p>Lowest affected area types score between <b>1 - 3 on the severance index.</b>`
   },
   moderate_areas: {
    title: "Moderately affected area types",
    content: `<p>An area which has been identified as having SRN, MRN, and/or rail network infrastructure which restricts walkable access to select, key destination(s).
    <p>Moderately affected area types score between <b>4 - 7 on the severance index.</b>`
   },
   mrn: {
    title: "Major Road Network (MRN)",
    content: `<p>The major road network (MRN) in England is a classification of local authority roads that includes the Strategic Road Network (SRN) managed by <b>National Highways</b> and other <b>major local authority-controlled A roads.</b>
    <p>The MRN accounts for about <b>4% of the nation's road length</b> but handles <b>43% of traffic flows.</b>
    <p>The MRN was established to ensure <b>central government funding</b> is effectively targeted towards <b>economically critical road infrastructure</b>. It includes roads with high traffic volumes and those connecting towns with <b>populations over 50,000.</b>`,
   },
   no_access: {
    title: "No access areas",
    content: `<p>An area which has been identified as having <b>no severance</b> due to the SRN, MRN, and/or rail network infrastructure and residents <b>have no perfect 10-minute walkable access</b> to any select, key destination(s).`
   },
   output_area: {
    title:"Output areas (OAs)",
    content: `<p>Output areas (OAs) are the <b>smallest geographical units</b> used for census data in the UK. Each OA typically consists of <b>40 to 250 households</b> and a <b>population of 100 to 625 people.</b> They were first created for the 2001 Census and are designed to be as socially homogeneous as possible.
    <p>OAs are used to ensure <b>detailed</b> and <b>accurate statistical analysis</b> while maintaining the confidentiality of individuals. They form the building blocks for larger geographical areas like <b>Lower Layer Super Output Areas (LSOAs)</b> and <b>Middle Layer Super Output Areas (MSOAs).</b>`,
   },
   perfect_areas: {
    title: "Perfect access areas",
    content: `<p>An area which has been identified as having <b>no severance</b> due to the SRN, MRN, and/or rail network infrastructure and residents <b>have a perfect 10-minute walkable access</b> to select, key destination(s).`
   },
   rail_network: {
    title: "Rail network",
    content: `<p>The rail network refers to a system of intersecting rail routes used for transporting <b>passengers</b> and <b>freight.</b>
    <p><b>Network Rail</b> manages railway infrastructure in Great Britain.`
   },
   severance: {
    title: "Severance",
    content: `<p>Severance can be understood as the <b>negative impact</b> that infrastructure and public realm design can have on the travel <b>behaviours, perceptions</b>, and <b>wellbeing of local people</b> and those who need to navigate a particular area. Sometimes described as the <b>barrier effect</b>, severance often refers to the separation of people from facilities, services, and social networks within a community.`
   },
   severe_areas: {
    title: "Severely affected area types",
    content: `<p>An area which has been identified as having SRN, MRN, and/or rail network infrastructure which restricts walkable access to select, key destination(s).
    <p>Severely affected area types score between <b>8 - 10 on the severance index.</b>`
   },
   severence_index: {
    title: "Severance index score",
    content: `<p>The severance index score is a <b>10-point decile scoring system</b> developed for our analysis of severance across England.
    <p>The scoring system is applied to <b>each OA</b> where the SRN, MRN, or rail network are found, along with the key service destinations. In its purest form, the decile scoring system <b>ranks residents’ ability in an OA</b> to access key services within a 10-minute walking reach distance where the SRN, MRN, or rail network intersect with communities.`
   },
   srn: {
    title: "Strategic Road Network (SRN)",
    content: `<p>The strategic road network (SRN) in England consists of motorways and major A roads. It spans over <b>4,500 miles</b> and is managed by <b>National Highways.</b> The network is crucial for the nation's economy, facilitating the movement of people and goods, and connecting major towns and cities. 
    <p>The SRN carries a significant portion of traffic, including a <b>third of all road traffic</b> and <b>two-thirds of all freight.</b> It includes secondary arterial roads, primary arterial roads, expressways, and motorways.`
   },
   stb: {
    title:"STB",
    content: `<p>A sub-national transport body (STB) is a transport governance organisation in England, designed to <b>provide strategic transport planning</b> and coordination at a larger scale than local transport authorities. STBs work with their respective councils to develop and implement transport strategies for their regions.
    <p>England’s STBs are: 
    <ul><b><li>Transport for the North</li><li>Midlands Connect</li><li>Transport East</li><li>England’s Economic Heartland</li><li>Transport for the South East</li><li>Western Gateway</li><li>Peninsula Transport</li></b></ul>`,
   },
   tfn: {
    title:"TfN",
    content: `<p>Transport for the North (TfN) is the <b>North of England’s STB.</b><p>TfN was the first statutory STB to be <b>created in 2018</b> under the Cities and Local Government Devolution Act 2016.`,
   },
   tire: {
    title: "Transport Infrastructure Related Severance",
    content: `<p>For the purpose of this tool, is defined as the severance to destinations that is attributable to transport related infrastructure as opposed to other forms of severance (other severance not attributable to transport infrastructure such as cul-de-sac design, or canals).`
   },
   trse: {
    title: "Transport-related social exclusion (TRSE)",
    content: `<p>Transport-related social exclusion (TRSE) is the <b>inability to participate in society</b> as much as required due to transport issues.
    <p>An impact of severance is TRSE.`
   },
   walkable_reach: {
    title: "10-minute walkable reach",
    content: `<p>A 10-minute walkable reach (also referred to as a ‘perfect 10-minute walkable reach’) refers to the <b>10-minute distance covered when walking at 4.82 km/h</b> and what destinations you are able to access in this timeframe.`
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
  