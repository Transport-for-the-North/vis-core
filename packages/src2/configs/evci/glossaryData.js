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
    introduction: {
      title: "Getting Started",
      content: `<p>The EVCI Framework model uses projected vehicle stock and network movement inputs in its future charging calculations.
  The geographic distribution of the EV stock determines how these vehicles fit into TfN's highway model flow and movement data.
  Consequently, changing the geographic distribution of EVs directly impacts charging demand.
  This projected vehicle stock evolves through an age-based vehicle replacement and the influx of new vehicle sales.
  There are two ways to view this vehicle stock projection in TfN's EVCI Framework:</p>
  <ol><li>Default: Forecasted new sales are broken down by expectations in vehicle type (car, van and HGC), body and fuel type
  but distribution factors are regionally homogenous or even.</li>
  <li>Income: Forecasted new sales are based on socioeconomic relationships between vehicle costs associated with ULEV price accessibility.
  Outlines a more uneven prediction of EV uptake, highlighting areas which could 'electrify' faster or which are vulnerable to transport related 
  social exclusion associated with decarbonisation of the vehicle stock.</li></ol>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    introSecondPart: {
      title: "Outputs to analyse",
      content: `<p>Select an output to analyse. Each selection will show further options and fill the map panel with results.</p>
  <p>To get further help, type or select a topic in the top-left box.</p>`,
      exclude: [],
    },
    income: {
      title: "Applications of TfN's income-based EV uptake lens",
      content: `<p>Assess the likely distribution of EV uptake amongst different socioeconomic groups.</p>
  <ul><li>Support a stronger correlation between demand and charging infrastructure investment.</li>
  <li>But also highlight the more difficult task of decarbonising via EVs for some areas of our region.</li></ul>
  <p>Uses can include:</p>
  <ul><li>Identify priority areas for faster deployment to support early EV uptake, high annual mileages (higher emitting trips) and charging demand;
  or to be more commercially attractive.</li>
  <li>Link with household compositions to target areas with high earlier EV uptake with no off-street charging.</li>
  <li>Support stimulus for more policy or infrastructure action to improve social access to EV solutions where uptake may be slower in the short term
  (including were charging access is a blocker).</li>
  <li>Understand areas of low uptake and possible need for other decarbonised travel options in the short to medium term
  (i.e. public transport and active travel connectivity).</li>
  <li>Link to distance travelled to target areas of high potential uptake and the high emitting journeys.</li>
  <li>Understand potential first and second-hand market impacts to better inform planning.</li></ul>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    model: {
      title: "Vehicle Stock Projection views, Default and Income",
      content: `<p>The EVCI Framework model uses projected vehicle stock and network movement inputs in its future charging calculations.
  The geographic distribution of the EV stock determines how these vehicles fit into TfN's highway model flow and movement data.
  Consequently, changing the geographic distribution of EVs directly impacts charging demand.
  This projected vehicle stock evolves through an age-based vehicle replacement and the influx of new vehicle sales.
  There are two ways to view this vehicle stock projection in TfN's EVCI Framework:</p>
  <ol><li>Default: Forecasted new sales are broken down by expectations in vehicle type (car, van and HGC), body and fuel type
  but distribution factors are regionally homogenous or even.</li>
  <li>Income: Forecasted new sales are based on socioeconomic relationships between vehicle costs associated with ULEV price accessibility.
  Outlines a more uneven prediction of EV uptake, highlighting areas which could 'electrify' faster or which are vulnerable to transport related 
  social exclusion associated with decarbonisation of the vehicle stock.</li></ol>
  <p>Select an output to analyse. Each selection will show further options and fill the map panel with results.</p>
  <p>To get further help, type or select a topic in the top-left box.</p>`,
      exclude: [],
    },
    progress: {
      title: "Monitoring progress towards EV charging needs",
      content: `<p>Beta project to pilot application of the
  <a href="https://chargepoints.dft.gov.uk/">National Chargepoint (NCR) registry</a> as a monitoring and evaluation capability against
  TfN's forecasted requirements (for publicly available charge points).
  All numbers by area, points on map, and applications on road network are based on NCR data downloads.
  The user should verify this data when using beyond strategic planning purposes.
  The user should also note the quality of this data may not be as full as other data sets,
  as it is the responsibility of the operator to add EVI to this database
  (although comparisons have shown reasonable agreement for application in this strategic toolkit).</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    method: {
      title: "Method (Forecast)",
      content: `<p>For details of the approach please 
      <a href="https://transportforthenorth.com/major-roads-network/electric-vehicle-charging-infrastructure/"
      target="_blank" rel="noopener noreferrer">refer to the full method</a>.</p>`,
      exclude: [],
    },
    evcp: {
      title: "Electric Vehicle Charging Point (EVCP)",
      content: `<p>EVCP stands for electric vehicle charge points and refers to the number of charging connections (plugs) vehicles can plug into. 
      In many cases this is the same as the number of charging posts or chargers but can be different in cases where one charging post supports multiple charging plugs.</p>`,
      exclude: [],
    },
    annualChargingDemand: {
      title: "Annual Charging Demand",
      content: `<p>Gives the expected annual energy demand in kWh that vehicles are expected to require from each charging category.</p>
      <p>Note that every kWh of energy demand corresponds to roughly 6 km driven by a car, 3 km by a van, or 1 km driven by a heavy goods vehicle.</p>`,
      exclude: [],
    },
    commercialViability: {
      title: "Commercial viability assessment",
      content: `<p>Assesses EVCI commercial investment viability, to inform LA strategic decisions and business and commercial deployment activities.​</p>
      <p>Identifies key characteristics of areas with likely strong potential return on investment suitable for commercial CPO interest.​</p>
      <p>Presents a methodology that can highlight areas where a single issue is causing challenge (for example energy supply or rurality).​</p>
      <p>Identifies characteristics of areas which are strategically important for social equality and inclusivity and require public sector support due to lower commercial viability but high societal value.​</p>
      <p>Supports TfN's objective of a whole network solution across the region.​</p>`,
      exclude: [],
    },
    multiModalHub: {
      title: "Multi-modal hub potential scoring",
      content: `
      <p>Multi-modal hub suitability and demand scoring based on publicly available data sources and from TfN. This includes grid capacity, existing EV network, EV and EVCI forecast, Rail and bus station locations and OD demand, proximity to highway network and enviro considerations.​</p>
      <p>Further specific site investigation and development work is advised for any locations of interest.​</p>`,
      exclude: [],
    },
    offStreetParkingAccess: {
      title: "Off-street parking accessibility",
      content: `<p>Identifies which households within areas may be reliant on public charging or an on-street solution. This function maps on/off street parking access across 6.4m households (public and more detailed private sharing).​</p>
      <p>By using a combination of Bluesky's 12.5cm resolution aerial photography, new OS National Geographic Database (NDG) data and a cutting-edge object detection algorithm, a process has been devised that will identify driveways from aerial photography.​</p>
      <p>This new methodology outperforms previous approaches used by TfN and others, which is to use of house type (i.e. terraced, semi-detached, detached ) to infer driveway presence. TfN has integrated the driveway findings into its EVCI Framework to better inform projections of charge point requirements, and will be applying this function across the wider TfN Anlytical Framework to shape other areas of TfN work.​</p>
      <p>Additional data is available to TfN’s local authority or statutory partners with Ordnance Survey Public Sector Geospatial Agreements. This includes household level information and geometries. TfN partners can receive this data free of charge (via TfN) to inform future decisions around public EVCI.</p>`,
      exclude: [],
    },
    forecastedChargingDemand: {
      title: "Forecasted charging demand vrs electricity headroom",
      content: `<p>An assessment of electricity grid capacity (for all the Primary Substations within the TfN region) against TfN’s projected EV demand and EVCI requirements.  This estimates the potential impact of EV charging on the future headroom capacity for each primary substation for the forecasted years of 2025, 2030 and 2035.​</p>
      <p>A RAG classification, based on primary substation’s existing capacity, was applied to identify and categorise which primary substations could handle increasing demand for EV charging without needing additional reinforcement.​</p>
      <p>This assessment is for electricity demand to power the projected EV demand, and does not include assessments for other uses such as heating.​</p>`,
      exclude: [],
    },
    headroom: {
      title: "Headroom",
      content: `<p>Demand headroom is the gap between the rating of the electricity network to supply electrical demand, and the actual demand in that part of the network.​</p>`,
      exclude: [],
    },
    electricitySubStation: {
      title: "Electricity sub-station",
      content: `<p>Substations are integral features within that grid and enable electricity to be transmitted at different voltages, securely and reliably. Substations contain the specialist equipment that allows the voltage of electricity to be transformed (or ‘switched’). The voltage is stepped up or down through pieces of equipment called transformers, which sit within a substation’s site.​</p>
      <p>Primary substations are the interconnection between high voltage and medium voltage. Secondary substations are the interconnection between medium and low voltage.</p>`,
      exclude: [],
    },
    digitallyDistributed: {
      title: "Future Travel Scenario: Digitally Distributed in 2050",
      content: `<p><i>What if society sees rapid advances in digital connectivity and uptake of new technologies across our economy?</i></p>
      <p>This scenario sees a future where growth is stimulated by rapid advances in technology, particularly the take-up of electric and self-driving vehicles, 
      transforming how people work, travel and live. Many people own their own electric self-driving vehicle, but there is also instant access to shared “robotaxi” 
      services, particularly in cities. However, the convenience of self-driving cars and low regulation of outcomes has led to a decline in public transport use, 
      exacerbating issues like inequality and congestion.</p>
      <p>Despite less commuting, business and shopping trips, average trip lengths have increased as a result of more dispersed living locations. 
      Road congestion has increased even though digital networks and self-driving vehicles support more efficient use of the roads, because there 
      are now more single and even zero occupancy self-driving vehicles as vehicles drop off owners and users and then travel to waiting areas before picking them up. </p>
      <p>In 2030, a small proportion of the vehicle fleet is hybrid (passenger) or diesel (goods) due to flexibilities in the ZEV mandate for manufacturers. 
      The adoption of electric vehicles (EVs) has supported a significant long-term reduction in tailpipe emissions. However, there is growing focus on total carbon, 
      including the carbon required to build vehicles and roads, which is a continuing challenge for all levels of government. There is also growing concern and 
      challenge over the impact of transport on the environment and society more widely, which is negatively impacted by the domination of cars. </p>
      <p>There has also been a shift to more freight on rail, as more capacity has been created by less people using public transport and road being less attractive due to congestion. </p>
      <img src="/img/evci/dd-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    district: {
      title: "Local authority district boundaries",
      content: `<p>Districts use 2023 geography, 
      <a href="https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeography" target="_blank" rel="noopener noreferrer">
      sourced from ONS</a>.</p>
      <p>The map visualisation shows approximate <i>super-generalised</i> boundaries, 
      but the model data matches the underlying detailed ONS boundaries.</p>`,
      exclude: [],
    },
    bev: {
      title: "Battery Electric Vehicle (BEV)",
      content: `<p>Fully electric vehicle, powered by energy stored in an on-board battery.</p>`,
      exclude: [],
    },
    evciModel: {
      title: "Electric Vehicle Charging Infrastructure (EVCI) model",
      content: `<p>The EVCI model projects charging infrastructure needs in the 
      North of England, and estimates Distribution Network Operator (DNO) reinforcement costs needed to support the Electric Vehicle (EV) 
      charging network.</p>
      <p>The time horizon is 2023, then 2025-2050, in 5 year increments.</p>
      <p>It uses elements of the TfN Analytical Framework as part of a comprehensive dataset, with the model available to use by 
      Local Authorities, DNOs, central Government, National Highways, Network Rail, and additional stakeholders.</p>
            <p>The overall objectives of TfN's EV charging infrastructure framework are to:</p>
      <ul>
      <li>Support delivery of an integrated EV network.</li>
      <li>Improve outcomes for Electric Vehicles based on robust and data driven evidence.</li>
      <li>Future-proof EV infrastructure decision making.</li>
      <li>Provide a collective road map towards an effective, attractive and inclusive network.</li>
      </ul>`,
      exclude: [],
    },
    justAboutManaging: {
      title: "Future Travel Scenario: Just About Managing in 2050",
      content: `<p><i>What if society sees a state of inertia – with economic, social and policy trends continuing into the long term? </i></p>
      <p>Limited investment in public infrastructure and services – and an increasing reliance on a range of commercial providers to provide public 
      services – has led to public transport service reductions, leaving a transport system which is running at capacity and is vulnerable to shocks.</p>
      <p>Cars remain the predominant mode of travel. Car ownership remains essential, especially for those living in rural or suburban areas as a consequence 
      of poor public transport alternatives. Despite progressive national policies, the adoption of electric vehicles (EVs) has been sluggish due to price 
      accessibility of EVs, user mentality of re-using petrol and diesel vehicles, and access concerns regarding charging. Whilst company fleet vehicles 
      successfully moved to electric to save costs, it has taken longer for individuals to make the switch to electric vehicles. Wealthier households have 
      benefitted disproportionately from the affordability of EVs, compared to less affluent households.</p>
      <p>In 2030, a significant proportion of the vehicle fleet is hybrid (passenger) or diesel (goods) due to flexibilities in the ZEV mandate for manufacturers.</p>
      <p>Chargepoints services are provided by a range of commercial providers with variable provision, quality, reliability and pricing. 
      The inequality of services and amenities are particularly evident across lower and higher income areas.</p>
      <p>With limited large-scale investment in transport infrastructure there has been limited growth in freight carried by rail due 
      to unresolved capacity constraints and low efficiency due to road congestion - but the majority of road freight travels by ZEVs (zero emission vehicles). </p>
      <img src="/img/evci/jam-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    msoa: {
      title: "Middle Layer Super Output Area (MSOA) boundaries",
      content: `<p>MSOAs are a 2021 census geography, 
      <a href="https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeography" target="_blank" rel="noopener noreferrer">
      sourced from ONS</a>.</p>
      <p>The map visualisation shows approximate <i>super-generalised</i> boundaries, 
      but the model data matches the underlying detailed ONS boundaries.</p>
      <p>The median size of an MSOA is about 3 km<sup>2</sup>. However MSOAs are defined by population size and social homogenity, not area, 
      so there can be large differences in scale, especially between rural and urban MSOAs.</p>`,
      exclude: [],
    },
    phev: {
      title: "Plug-in Hybrid Electric Vehicle (PHEV)",
      content: `<p>Vehicle which can be powered both from an on-board electric battery,
      charged by plugged-in cable, and internal combustion engine powered generator.</p>`,
      exclude: [],
    },
    travelScenarios: {
      title: "TfN's Future Travel Scenarios",
      content: `<p>Transport for the North uses a scenarios approach to understand and respond to the future uncertainty of how people will interact with the transport system in years ahead.</p>
      <p>Our Future Travel Scenarios are a shared understanding of the broad range of factors effecting current and future transport in the North of England. Scenarios are not predictions. 
      They are not intended to be <i>right</i> or <i>wrong</i>, <i>good</i> or <i>bad</i> statements, but are aimed at collaboratively exploring (as well as challenging and stretching) 
      our thinking towards the alternative ways the transport landscape might develop, and the actions we might take.</p>
      <p>Each scenario represents a bundle of inputs relating to where people live, their trip distances and the proportion of trips by car. 
      For this tool, these inputs can be changed using a single switch in the model to explore the requirements of EV charging across different travel demand scenarios.</p>
      <p>The outputs indicate the changes in charging demand and number of charge points across MSOAs, and en-route charging, for the 4 futures worlds described in TfN's travel scenarios.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    liveLocal: {
      title: "Future Travel Scenario: Live Local in 2050",
      content: `<p><i>What if smaller cities, towns and more rural areas became the driver of a more balanced and thriving society? </i></p>
      <p>As a result of devolution and a societal shift that places higher value on quality of life and community, smaller cities, towns, and rural and 
      coastal areas in the North are flourishing. The emphasis on quality of life has reshaped many aspects of daily living. Work patterns have evolved, 
      with more people embracing flexible work arrangements, allowing more time for leisure to enjoy the natural beauty of the North. Consumption habits 
      support local business and sustainable practices. New technologies are embraced when they enhance well-being and contribute to wider sustainability goals.</p>
      <p>National government transport policies have led to a moderate adoption of electric vehicles, of over the last decades, whilst also implementing a 
      new mobility pricing system new road tax to charge electric vehicles for their use of roads. Sustainable local transport investments have been encouraged 
      and funded, as well as more intra-community public transport links.</p>
      <p>Take up of electric vehicles (EVs) has happened at a moderate pace, slowed because people have tended to hold onto their vehicles for longer; 
      although once a sustainable second-hand market for EVs was in place take-up rates increased. There is a strong ethos for re-using materials that is 
      evident in the strong second-hand battery market. Shorter local trips are undertaken by walking, cycling, scooting or (electric) public transport, 
      which have led to reductions in personal car ownership and use of more (electric) shared car options. In 2030, a large proportion of the vehicle fleet 
      is hybrid (passenger) or diesel (goods) due to flexibilities in the ZEV mandate for manufacturers.</p>
      <p>The strategic use of local distribution hubs has reduced transportation costs of last mile freight deliveries, many of which are undertaken 
      by small electric vehicles or by e-cargo bikes. There is also a greater emphasis on local sourcing of goods which supports the regional economy – 
      resulting in shorter supply chains transportation distance and cost reduction, and improvement in resilience. </p>
      <img src="/img/evci/ll-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    metropolitanMobility: {
      title: "Future Travel Scenario: Metropolitan Mobility in 2050",
      content: `<p><i>What if society embraces sustainable urban living to tackle climate change and meet Net Zero targets?</i></p>
      <p>The combination of public attitudes towards climate change, devolved powers to city and combined authority leaders and strong fiscal and regulatory 
      policies by the UK national government during the 2020s has led to growing and successful cities with high-quality public transport services and high-take-up 
      of zero emission vehicles. New technologies have combined with public transport services to provide seamlessly connected transport services that have helped 
      transform economic productivity and growth in cities. Tax reform of how we pay for transport has generated revenues to support transport investment more widely, 
      with money ringfenced for public transport and active travel investment.</p>
      <p>Cities provide a thriving environment to walk, cycle and wheel that enables easy movement and travel to and from self-driving buses, trains or shared vehicles.
      Car ownership has declined in cities, as owning a car has become an unnecessary and undesirable. Outside of cities, mobility hubs provide digital connectivity and 
      working spaces, as well as access to local services and public and shared transport.</p>
      <p>In 2030, the vehicle fleet only contains a small number of hybrids (passenger) and goods vehicles have transitioned more quickly to cleaner options, 
      regardless of flexibilities in the ZEV mandate for manufacturers. The switch to zero emission vehicles, combined with a shift towards the use of sustainable 
      transport modes has led to significant decarbonisation across the transport sector. Transport, land-use and energy planning and systems are integrated to 
      deliver effective and efficient clean networks. The UK has led the development of renewable energy and Carbon Capture and Storage which has proven necessary 
      in offsetting residual transport emissions. Cars, light-goods vehicles and small heavy goods vehicles are electric powered. An increasing supply of zero carbon 
      hydrogen is available for larger heavy-duty vehicles.</p>
      <p>Freight is delivered to combined urban freight centres and charging / refuelling stations by zero-emission freight vehicles 
      at a faster rate than the ZEV Mandate and, increasingly, by electrified rail.</p>
      <img src="/img/evci/mm-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    evcpUptake: {
      title: "EV uptake",
      content: `<p>Gives the number of electric vehicles (EVs) that are expected across the region, 
      split by powertrain type (battery electric or plug-in hybrid) and vehicle type (car, van, or heavy goods vehicle).</p>`,
      exclude: [],
    },
    topPotentialEnRouteRapidChargingLocations: {
      title: "Potential en-route charging sites",
      content: `<p>Shows the sites within a region with the most potential for the installation of en-route charging infrastructure.
      This ranking is not designed to provide users with specific parcels of land for development but is instead designed to show broader
      regions where rapid charging hub development looks promising.</p>
      <p>These dots are designed to be used alongside "En-route charging demand by major road" data which can be used to identify
      regions with a need for public charging. Once a region has been identified the "Potential en-route charging sites" data
      provides the user with local information (greenbelt restriction, risk of flooding, local traffic flow,
      existing local charging hubs, a lack of local off street parking) which can be used to identify areas of interest.</p>
      <p>These sites are potential areas where rapid charging hubs (likely to be 5 or more chargers) could be installed, however a detailed analysis of the local area 
      (including planning restrictions, currently installed chargers, nearby amenities, and electricity grid connection costs) 
      would be required to determine if installation is feasible and how many chargers should be installed.</p>
      <p>Sites are expressed relative to the single best scored site in the TfN area.
      Only sites meeting a minimum threshold have been included.
      Each point represents a hexagonal cell of side length 620 metres, centred on the point shown.</p>`,
      exclude: [],
    },
    behaviouralScenario: {
      title: "Behavioural scenario",
      content: `<p>Defines the assumptions around how and where drivers will use electric vehicle charging.</p>
      <p>Currently 4 scenarios are available:</p>
      <ul>
      <li>Baseline: charging behaviour follows current observed trends: 
      most charging is done at or near home, with some taking place at destinations or en-route.</li>
      <li>Destination focus: charging behaviour changes from current behaviour to be more prevalent at destinations away from the driver's home location.</li>
      <li>Local public charging hub focus: charging behaviour changes from current behaviour to be more prevalent at local charging hub destinations away from the drivers home location.</li>
      <li>Queuing acceptance: charging behaviour follows current observed trends (baseline) but with an user acceptance to queue at times of peak demand for a charge, rather than a requirement for a charger being available during peak at all times.</li>
      </ul>`,
      exclude: [],
    },
    chargingCategories: {
      title: "Charging categories",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>There are 5 charging categories defined for cars and vans, and 2 for heavy goods vehicles:</p>
      <p><strong>Cars and vans</strong></p>
      <ul>
      <li>Destination: Charging which occurs in locations such as supermarkets, gyms, etc. 
      This is typically at a 8 kW charger where a user stays for 30 - 60 minutes.</li>
      <li>Home: Charging which occurs off-street in a driver's private garage or other private parking location. 
      We assume the use of a 8 kW charger.</li>
      <li>En-route rapid: Charging which occurs during a journey, similar to refuelling with petrol at a motorway service station. 
      Chargers tend to support at least 50 kW, and sometimes 150 - 350 kW charging, allowing for short charging times. 
      Due to lower powered chargers and lower power acceptance rates by vehicles, in the short term, 
      charging rates are assumed to increase over time from 50 kW today to 150 kW in the future.</li>
      <li>Public residential: Charging which occurs on-street near a driver's home location, for example while parked on a local road or in a public car park. 
      We assume the use of a 8 kW charger.</li>
      <li>Workplace: Charging which occurs at or near a driver's place of work. 
      Only accessible to drivers who use their vehicle for commuting. We assume the use of a 8 kW charger.</li>
      </ul>
      <p><strong>Heavy goods vehicles</strong></p>
      <ul>
      <li>HGV depot: Charging which occurs in the depot where the vehicle is kept overnight.</li>
      <li>HGV en-route: Charging which occurs during a journey, similar to a truck refuelling with diesel at a motorway service area.</li>
      </ul>`,
      exclude: ["tfn", "tfse"],
    },
    tfnChargingCategories: {
      title: "Charging categories",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>There are 6 charging categories defined for cars and vans, and 2 for heavy goods vehicles:</p>
      <p><strong>Cars and vans</strong></p>
      <ul>
      <li>Destination: Charging which occurs in locations such as supermarkets, gyms, etc. 
      This is typically at a 8 kW charger where a user stays for 30 - 60 minutes.</li>
      <li>Home: Charging which occurs off-street in a driver's private garage or other private parking location. 
      We assume the use of a 8 kW charger.</li>
      <li>En-route rapid: Charging which occurs during a journey, similar to refuelling with petrol at a motorway service station. 
      Chargers tend to support at least 50 kW, and sometimes 150 - 350 kW charging, allowing for short charging times. 
      Due to lower powered chargers and lower power acceptance rates by vehicles, in the short term, 
      charging rates are assumed to increase over time from 50 kW today to 150 kW in the future.</li>
      <li>Public residential: Charging which occurs on-street near a driver's home location, for example while parked on a local road or in a public car park. 
      We assume the use of a 8 kW charger.</li>
      <li>Workplace: Charging which occurs at or near a driver's place of work. 
      Only accessible to drivers who use their vehicle for commuting. We assume the use of a 8 kW charger.</li>
      <li>Local charging hub: 
      TfN defines a local charging hub as a grouped hub of charge points, typically providing a mixture of slow to fast AC chargers, 
      and a number of rapid chargers. This would support scheduled slots for overnight charging and an app to book a shorter slot for a top up if needed. 
      Example locations include private car parks and local authority / community car parks, such as schools and libraries. 
      <br> Although well-used, the popularity of local charging hubs is still to be proven in terms of preference over residential charging. 
      However, TfN feel it important to provide our partnership with a view of what this approach may mean for areas across the region. </li>
      </ul>
      <p><strong>Heavy goods vehicles</strong></p>
      <ul>
      <li>HGV depot: Charging which occurs in the depot where the vehicle is kept overnight.</li>
      <li>HGV en-route: Charging which occurs during a journey, similar to a truck refuelling with diesel at a motorway service area.</li>
      </ul>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    tfseChargingCategories: {
      title: "Charging categories",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>There are 6 charging categories defined for cars and vans, 1 for buses and 2 for heavy goods vehicles:</p>
      <p><strong>Cars and vans</strong></p>
      <ul>
      <li>Destination: Charging which occurs in locations such as supermarkets, gyms, etc. 
      This is typically at a 8 kW charger where a user stays for 30 - 60 minutes.</li>
      <li>Home: Charging which occurs off-street in a driver's private garage or other private parking location. 
      We assume the use of a 8 kW charger.</li>
      <li>En-route rapid: Charging which occurs during a journey, similar to refuelling with petrol at a motorway service station. 
      Chargers tend to support at least 50 kW, and sometimes 150 - 350 kW charging, allowing for short charging times. 
      Due to lower powered chargers and lower power acceptance rates by vehicles, in the short term, 
      charging rates are assumed to increase over time from 50 kW today to 150 kW in the future.</li>
      <li>Public residential: Charging which occurs on-street near a driver's home location, for example while parked on a local road or in a public car park. 
      We assume the use of a 8 kW charger.</li>
      <li>Workplace: Charging which occurs at or near a driver's place of work. 
      Only accessible to drivers who use their vehicle for commuting. We assume the use of a 8 kW charger.</li>
      <li>Van depot: Charging which occurs in the depot during the day or overnight, at a mix of AC (Alternating Current) and DC (direct Current) chargers between 8 kW and 50 kW.</li>
      </ul>
      <p><strong>Buses</strong></p>
      <ul>
      <li>Bus depot: Charging which occurs in the depot where Buses are kept overnight, where buses charge at an average power rating of 60 kW.</li>
      </ul>
      <p><strong>Heavy goods vehicles</strong></p>
      <ul>
      <li>HGV depot: Charging which occurs in the depot where the vehicle is kept overnight.</li>
      <li>HGV en-route: Charging which occurs during a journey, similar to a truck refuelling with diesel at a motorway service area.</li>
      </ul>`,
      exclude: ["mc", "tfn", "eeh", "wg", "peninsula", "te"],
    },
    destination: {
      title: "Destination charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>Destination: Charging which occurs in locations such as supermarkets, gyms, etc. 
      This is assumed to take place at a 8 kW charger where a user stays for 30 - 60 minutes.</p>`,
      exclude: [],
    },
    home: {
      title: "Home charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>Home: Charging which occurs off-street in a driver's private garage or other private parking. We assume the use of a 8 kW charger.</p>`,
      exclude: [],
    },
    enRoute: {
      title: "En-route charging",
      content: `<p>Within the core forecast, charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <ul>
      <li>Cars and vans: En-route rapid: Charging which occurs during a journey, similar to refuelling with petrol at a motorway service station. 
      Chargers tend to support at least 50 kW, and sometimes 150 - 350 kW charging, allowing for short charging times.</li>
      <li>Heavy goods vehicles: En-route: Charging which occurs during a journey, similar to a truck refuelling with diesel at a motorway service area.</li>
      </ul>`,
      exclude: [],
    },
    publicResidential: {
      title: "Public residential charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>Public residential: Charging which occurs on-street near a driver's home location, 
      for example while parked on a local road or in a public car park. We assume the use of a 8 kW charger.</p>`,
      exclude: [],
    },
    workplace: {
      title: "Workplace charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>Workplace: Charging which occurs at or near a driver's place of work. Only accessible to drivers who use their vehicle for commuting. 
      We assume the use of a 8 kW charger.</p>`,
      exclude: [],
    },
    depot: {
      title: "Depot charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>HGV depot: Charging which occurs in the depot where the heavy goods vehicle is kept overnight.</p>`,
      exclude: ["tfse"],
    },
    depotTfse: {
      title: "Depot charging",
      content: `<p>Charging categories define the different contexts in which people may charge an electric vehicle.</p>
      <p>HGV depot: Charging which occurs in the depot where the heavy goods vehicle is kept overnight.</p>
      <p>Van depot: Charging which occurs in the depot during the day or overnight, at a mix of AC (Alternating Current) and DC (Direct Current) chargers between 8 kW and 50 kW.</p>
      <p>Bus depot: Charging which occurs in the depot where buses are kept overnight, where buses charge at an average power rating of 60 kW.</p>`,
      exclude: ["mc", "tfn", "eeh", "wg", "peninsula", "te"],
    },
    density: {
      title: "Per square kilometre (sq km density)",
      content: `<p>Expresses the administrative boundary's total per unit (square kilometres) of land area.</p>`,
      exclude: [],
    },
    thousandVehicles: {
      title: "Per thousand vehicles",
      content: `<p>Expresses the administrative boundary's total charging demand as a proportion of all Electric Vehicles owned in the area. 
      A high score represents external vehicles entering the area and charging, for example commuters or holidaymakers.</p>`,
      exclude: [],
    },
    length: {
      title: "Per kilometre (km)",
      content: `<p>Expresses the road segment's charger or power total as a proportion of total length of the road segment.
      This allows road segments of different lengths to be compared fairly.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    majorRoad: {
      title: "Major roads network (MRN and SRN)",
      content: `<p>The <a href="https://transportforthenorth.com/major-roads-network/">major roads network</a> consists of TfN's "SRN" and "MRN" networks.
      These are the roads most likely to be used for non-local journeys - journeys which are most likely to need en-route charging.</p>
      <p>Longer roads are broken into multiple segments for ease of analysis, typically between major junctions.</p>
      <p>Analysis of actual charge points summarises those within 250 metres (or 500m in rural areas), aggregated to each road segment.
      The wider rural buffer reflects the ease of placing facilities slightly further from the carriageway in rural areas.
      These distances are measured in a straight line. Direct access from the carriageway is assumed.
      Segregated carriageway road segments will therefore sometimes include sites which cannot be easily accessed,
      although in practice charging hubs are almost always strategically placed near junctions.</p>
      <p>Where one charge point matches more than one road segment, that charge point's data is split evenly between the overlapping road segments.
      This can result in device totals that are not whole numbers.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    monitor: {
      title: "Monitor (existing charge points)",
      content: `<p>Beta project to pilot application of the
  <a href="https://chargepoints.dft.gov.uk/">National Chargepoint (NCR) registry</a> data as a monitoring and evaluation capability against
      TfN's forecasted requirements (for publicly available charge points).
      All numbers by area, points on map, and applications on road network are based on NCR data downloads.
      The user should verify this data when using beyond strategic planning purposes.
      The user should also note the quality of this data may not be as full as other data sets,
      as it is the responsibility of the operator to add EVI to this database
      (although comparisons have shown reasonable agreement for application in this strategic toolkit).</p>
      <p>Analysed recent data from the National Chargepoint Registry can be mapped.
      The NCR only includes publicly accessible chargepoints. Analysis is provided for:</p>
      <ul>
      <li>Chargers: A count of individual devices (as defined by the NCR), where a device may have multiple connectors.</li>
      <li>Installed charger power: The kilowatt rating of the most powerful connector attached to each device.</li>
      </ul>
      <p>Chargers with precisely the same geographic coordinates are aggregated.
      For example, a 5 kW device and a 50 kW device would sum to 55 kW of installed charger power.
      In practice, the accuracy with which devices are located is inconsistent within NCR, so locations should be considered approximate.
      For example, a charging hub may appear as one multi-device site by postcode, one multi-device site by centroid,
      or a sequence of charging devices laid out in across a car park.</p>
      <p>Charge point devices are categorised by speed:</p>
      <ul>
      <li>Any non-rapid (likely to be used for longer-duration stops): <ul><li>Slow: 0-8 kW</li><li>Fast: 8-50 kW</li></ul></li>
      <li>Any rapid or faster (likely to be used for en-route mid-journey stops): <ul><li>Rapid: 50-150 kW</li><li>Ultra-rapid: 150+ kW</li></ul></li>
      </ul>
      <p>50 kW is the <a href="https://www.legislation.gov.uk/ukdsi/2023/9780348249873">statutory minimum</a> for a rapid charger.
      Sub-categories mimic those proposed by the Zemo Partnership.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    speed: {
      title: "Speed (existing charge points)",
      content: `<p>Existing charge points are categorised by speed, assessed on the kilowatt rating of the highest-power connector attached to each charge point device:</p>
      <ul>
      <li>Any non-rapid (likely to be used for longer-duration stops): <ul><li>Slow: 0-8 kW</li><li>Fast: 8-50 kW</li></ul></li>
      <li>Any rapid or faster (likely to be used for en-route mid-journey stops): <ul><li>Rapid: 50-150 kW</li><li>Ultra-rapid: 150+ kW</li></ul></li>
      </ul>
      <p>50 kW is the <a href="https://www.legislation.gov.uk/ukdsi/2023/9780348249873">statutory minimum</a> for a rapid charger.
      Sub-categories mimic those proposed by the Zemo Partnership.</p>`,
      exclude: [],
    },
    charger: {
      title: "Charger (existing charge points)",
      content: `<p>This monitoring capability applies Zap Map data, which has been agreed for sharing within the TfN EVCI Framework. Further information not provided in this 
      public tool is available for TfN's local authority partners on request.</p>
      <p>Please note that for current/installed chargepoints, the totals are the number of devices, whereas for the forecasted numbers these are given as chargepoint plugs.</p>
      <p>Speed definitions:
      <ul>
      <li>Slow - less than 8kW</li>
      <li>Fast - 8kW to less than 50 kW</li>
      <li>Rapid - 50kW to less than 150kW</li>
      <li>Ultra-rapid - 150kW or higher</li>
      </ul></p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    enRouteRoad: {
      title: "En-route charging by major road",
      content: `<p>Analyses the likelihood of vehicles stopping to charge during their journeys, by major road (MRN and SRN) segment.</p>
      <p>This analysis is derived from the flows contained within TfN's Saturn traffic model:
      The route of each journey is traced from origin to destination, junction by junction.
      On each stage of the journey, the probability of the driver stopping to charge is calculated,
      based on a vehicle range and battery size distribution.
      Car, van and articulated HGV stopping distance is distributed between 130-290km, 180-310km and 290-410km
      respectively following a normal distribution pattern.</p>
      <p>The results across all journeys are summed for each section of road.
      This gives an indication of expected number of vehicles stopping to charge,
      annual en-route charging activity and annual en-route charging activity per km
      (each road segment is a different length, this output allows the user to compare two road segments fairly)
      in each 5 year increment from 2020 to 2050.</p>
      <p>Note that under "Forecast: Annual charging demand" "En-route" enroute charging is assigned to home location.
      In contrast, this road-based analysis allocates such charging to the places it is likely to occur.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    powerEnergy: {
      title: "Charging power (kW) and charging energy (kWh)",
      content: `<p>"Actual: Charger power" information is provided in the tool in kW.
      This tells the user about the combined rated power of all charge points in an area.
      Power refers to the amount of energy a charger can deliver to a vehicle in a second.
      The user can use this to assess if there are a large number of high power chargers installed.</p>
      <p>The tool also "Forecast: Annual charging demand" this is shown in kWh.
      A kWh is the amount of energy transferred to a vehicle if a 1kW charger were to be used for 1 hour.
      kWh of energy are what a driver pays for when buying electricity either at home or at a public charge point.</p>`,
      exclude: [],
    },
    co2savings: {
      title: "Forecast CO2 Savings",
      content: `<p>This is a measure of the cumulative CO2 emissions saved over time between the Travel Scenario
      selected and an EV-free Baseline Scenario. Additional effects also transform cumulative saved CO2,
      for instance, the Baseline Scenario captures the geographical population and economic shifts of
      the Travel Scenario selected, which can alter emissions. It also reflects the increase in Battery
      Electric Vehicle uptake and the small, but steady, improvement in the efficiency of the petrol
      and diesel fleet. This can mean in practise that the fossil fuel powered fleet becomes less carbon
      intensive over time and so the emission savings from each BEV added to the fleet may get smaller
      the further into the future the user looks.</p>`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
    businessAsUsual: {
      title: "Business As Usual",
      content: `<p><ul><li>Reflects central assumptions for exogenous drivers of demand and published 'firm and funded' policies.</li>
      <li>A 'common comparator' to assesses all project and options against remains the basis of the Appraisal Summary Table</li>
      <li>BAU BEV uptake for car: 23% 2025; 34% 2030; 40% 2040; 50% 2050</li></ul></p>
      <img src="/img/evci/bau-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: [],
    },
    accelaratedEv: {
      title: "Vehicle-led Decarbonisation (Accelerated EV)",
      content: `<p><ul><li>High and fast uptake of low-cost Electric Vehicles.</li>
      <li>Uses the Core NTEM/TEMPro scenario.</li>
      <li>AEV BEV uptake for car: 41% 2025; 72% 2030; 100% 2040</li></ul></p>
      <img src="/img/evci/aev-graph.png" alt="Graph plotting stock by year, one line per vehicle type" width="353" height="314" />`,
      exclude: [],
    },
    highwayNetwork: {
      title: "Highways Network",
      content:
        "<p>Highways Network - Regional highways network (MRN, SRN and key local roads) provided by National Highways Regional Traffic Models, covering car, van and HGVs.</p>",
    },
    optionalLocationFilter: {
      title: "Optional location filter",
      content: `<p>Show only selected zones in the map. Filter using the search box, or using the interactive tool.</p>
      <p>Pointer select: select the zone under the pointer and add it to the filter.</p>
      <p>Rectangle select: click anywhere on the map to start drawing a rectangle; drag then click again to add the zones within the rectangle to the filter.</p>`
    },
    commonAnalyticalScenarios: {
      title: "DfT Common Analytical Scenarios for EV uptake",
      content: `<p>Whilst TfN’s EVCI Framework provides outputs for 6 different scenarios (4 TfN Future Travel Scenarios and 2 national scenarios), 
      it has been agreed that roll out to other STBs will deliver representations of two national DfT transport scenarios in the first instance, these are:</p>
      <p><b>Scenario 1: Business As Usual (Core) </b></p><ul><li>Reflects central assumptions for exogenous drivers of demand and published ‘firm and funded’ policies.</li>
      <li>A ‘common comparator’ to assess all projects and options against. Remains the basis of the Appraisal Summary Table.</li>
      <li>BAU BEV uptake for car: 23% 2025; 34% 2030; 40% 2040, 50% 2050</li></ul><p><b>Scenario 2: Vehicle-led Decarbonisation (Accelerated EV) </b></p><ul><li>High and fast uptake of low-cost Electric Vehicles</li>
      <li>Uses the Core NTEM/TEMPro scenario.</li><li>AEV BEV uptake for car: 41% 2025; 72% 2030; 100% 2040</li></ul>
      <p>More information about the CAS scenarios can be found here, more information about NTEM is available here, and information regarding fuel mileage splits may be found in the TAG Databook. [hyperlinks].</p>
      <p>The EVCI framework uses a fleet-based approach to calculating VKM by fuel types. Vehicle kilometres are organically assigned to their local fleet of origin based
       on new vehicle sales by scenario assumption, this differs from the DfT approach, where proportion of mileage by scenario is set directly by scenario assumption. Consequently,
        TfN has replicated the DfT CAS scenarios used in the EVCI framework by adjusting vehicle sales by fuel to produce the VKM proportions by fuel type that match DfT scenarios.</p>
        <p>This process is complicated further as DfT’s fuel categories are fundamentally a property of the fuel type by which the mileage occurred, whereas TfN’s fuel type is
         fundamentally a property of the vehicle. For this reason, an ‘electric’ kilometre in DfT’s framework may have been travelled by a battery electric vehicle or a petrol
         hybrid vehicle in TfN’s framework. To translate between the two approaches, TfN uses the mileage splits of hybrid and PHEV vehicles from its CAFCarb model.</p>`,
      exclude: [],
    },
    download: {
      title: "Download",
      content: `<p>1. How do I view and download the results?</p>
      <li>You can either hover over a given LA, MSOA or location (depending on selection) or use the download data section. When wishing to download data, 
      click the arrow and then customise the selections as required before pressing ‘download’. Doing this will create a downloadable excel document in the top right. 
      Once downloaded, you can use the excel functions such as ‘filter and ‘autosum’ to support your calculations.  </li>
      <p>2. How do I combine Local Authorities (LAs) or Middle Super Output Areas when making calculations?</p>
      <li>In the ‘filtering and data selection’ section, click either LA or MSOA below ‘administrative boundaries’. Then, under ‘optional location filter’ click on ‘enable selector’. 
      Then simply click on the map and combine the LAs or MSOAs you desire. You can see them compile in the box. Simply re-click on the LA or MSOA on the map to remove or 
      click on the ‘x’ next to the name in the box. To remove them all, click on the larger ‘X’ to the right of the box.   </li>`
    },
    chargepointOutput: {
      title: "What do the chargepoint output numbers refer to?",
      content: '<p>Please note that for current/installed chargepoints, the totals are the number of devices, whereas for the forecasted numbers these are given as chargepoint plugs.</p>'
    },
    fleetProjection: {
      title: `Fleet projections`,
      content: `<p>The forecast EV fleet is created from NoCarb's fleet model which is informed by the local historic and current fleet, forecasting of population growth
      and car ownership from TfN's socioeconomic modelling, sales assumption for vehicle size and fuel type by scenario and announced government legislation, and age and
      replacement rate of the vehicle fleet.</p>
      <img src="/img/evci/fleet-graph.png" alt="Graph plotting fleet projections by scenario" width="353" height="314" />`
    },
    utilisation: {
      title: `Utilisation Behaviour Data`,
      content: `<p>The Baseline Behavioural Scenario is informed by ZapMap reporting on user engagement with the existing charging infrastructure. This includes hourly and total usage
      profiles throughout the day of the charger and the length of users charging sessions with the different categories of charging. Each of these influences the number of 
      chargers required to satisfy user demand and, consequently, existing behavioural data is used in future forecasts in addition to expectations in behavioural shifts.</p>`
    }
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
  