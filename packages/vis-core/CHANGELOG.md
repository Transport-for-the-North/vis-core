# [0.12.0](https://github.com/Transport-for-the-North/vis-core/compare/v0.11.0...v0.12.0) (2026-07-31)


### Bug Fixes

* add cross-filter correction functions and tests for initial and runtime values ([11a1a9a](https://github.com/Transport-for-the-North/vis-core/commit/11a1a9a43526723f6b33ffe50005d7be5baa60bd)), closes [#213](https://github.com/Transport-for-the-North/vis-core/issues/213)
* add per-visualisation loading counter to prevent premature dimmer dismissal ([8815f29](https://github.com/Transport-for-the-North/vis-core/commit/8815f29be1baf4994d6edae8be65f8de47418375))
* **api:** propagate fetch errors correctly to allow AbortError handling ([74bac91](https://github.com/Transport-for-the-North/vis-core/commit/74bac918dc39179d9a443155e0b391019052385f))
* **bronte:** add native tooltips for truncated multiselect chips (BRONTE-0022) ([95e8531](https://github.com/Transport-for-the-North/vis-core/commit/95e8531a6a478cb6abbe44f789725ad786b6a1de))
* **bronte:** apply natural sorting to zoom-to-feature options (BRONTE-0008) ([b325124](https://github.com/Transport-for-the-North/vis-core/commit/b325124bc1ab8aa65355ff477fe9172a14e74294))
* **CalloutCard:** ensure handle doesn't appear on mobile ([91837b7](https://github.com/Transport-for-the-North/vis-core/commit/91837b7532fdf575a3cc0c65c94a3af91588d97b))
* **CalloutCard:** ensure updated toggle timers are aligned ([9ccdb1c](https://github.com/Transport-for-the-North/vis-core/commit/9ccdb1cae362bb914b2c37e3bdc97548f1baa30f))
* **CalloutCard:** prevent layout shift when updating ([a76689d](https://github.com/Transport-for-the-North/vis-core/commit/a76689d416b8945bc9a37c720e7fb4f65016a68e))
* **CalloutCard:** prevent layout shifts when re-rendering callout cards ([b91f27d](https://github.com/Transport-for-the-North/vis-core/commit/b91f27d4a7f1b0e0b5b7562a4f13bc93cde68967))
* **CalloutCardVisualisation:** remove duplicate declaration ([8bc4df8](https://github.com/Transport-for-the-North/vis-core/commit/8bc4df8d612b56361c66c712be0a8a8768866d81))
* **DynamicLegend:** ensure bins slice incorporates max value ([2fd3488](https://github.com/Transport-for-the-North/vis-core/commit/2fd348850e0cb55748c24476c0c7f399672727b1)), closes [#280](https://github.com/Transport-for-the-North/vis-core/issues/280)
* **DynamicLegend:** ensure out-of-range message reflects rounding ([5ae3cd4](https://github.com/Transport-for-the-North/vis-core/commit/5ae3cd4c91ce307050d34c38f001837f242ecdf0)), closes [#280](https://github.com/Transport-for-the-North/vis-core/issues/280)
* extend loading counter to include style-application phase ([9116a0a](https://github.com/Transport-for-the-North/vis-core/commit/9116a0a11539fb9ba3c152bad296406f043829a4))
* force a release after bad commit message in previous commmit ([c2c1a50](https://github.com/Transport-for-the-North/vis-core/commit/c2c1a501790448f1c5fbc65bf93678d93959c69b))
* **hooks:** resolve infinite fetch loop and race conditions in useFetchVisualisationData ([f3d4757](https://github.com/Transport-for-the-North/vis-core/commit/f3d4757947b11e5a9f0f8e5c0f84ad0e1abd02da))
* **MapLayout:** refactor map filter action payload construction so scalar and multiselect values are handled consistently; ([59f5194](https://github.com/Transport-for-the-North/vis-core/commit/59f519447c604ae1e0b3fb181cd26b5e4490f4f1))
* **MapVisualisation:** prevent infinite waiting by aborting styling process for layers with missing parameters ([d4a9ddc](https://github.com/Transport-for-the-North/vis-core/commit/d4a9ddc8e511681410f7fc180b5b0c6e9a400c94))
* preserve single bin value in normaliseContinuousBins ([ad88969](https://github.com/Transport-for-the-North/vis-core/commit/ad88969cef35d2f4d6555f2d44cdaacc8f790eb5))
* prevent effect triggers in multiselect dropdown by memoising callbacks in the MapLayout render chain ([73d59ac](https://github.com/Transport-for-the-North/vis-core/commit/73d59ac484889e8f5c7bcc5c9a38f9508d989458))
* replace Math.min/max spread with reduce in getOutOfBandFlags ([a4189b1](https://github.com/Transport-for-the-North/vis-core/commit/a4189b19adbfb592e68e954d4ae5ff87b054bf40))
* **Sidebar:** ensure multiselect dropdown correctly renders item chips when in mobile view ([b346ca5](https://github.com/Transport-for-the-North/vis-core/commit/b346ca5aeb72f13cd925f5f8d59379cc33e55eb7))
* **ui:** eliminate whitespace to the left of Y-axis ([eb1aa54](https://github.com/Transport-for-the-North/vis-core/commit/eb1aa5469424c5b78bf129255394ee2827214d63))
* **ui:** ensure clean tick intervals ([a45fe8f](https://github.com/Transport-for-the-North/vis-core/commit/a45fe8fa3a451f59c11beb5a8b11f6f068c4ad74))
* **ui:** ensure consistent margins and adequate buffer around charts ([d084c6d](https://github.com/Transport-for-the-North/vis-core/commit/d084c6dd396a4a60af155fcefbddc61d76a84a7f))
* **ui:** improve chart rendering styling and layout ([70baeb4](https://github.com/Transport-for-the-North/vis-core/commit/70baeb421f33602714728c68066887e1ef377f93))
* **ui:** resolve mobile callout card initialisation and mounting race conditions ([759d51d](https://github.com/Transport-for-the-North/vis-core/commit/759d51d2268e74e9369ebb9f861a65fda616b253))
* **ui:** unify category tick rendering and tighten chart spacing ([e735026](https://github.com/Transport-for-the-North/vis-core/commit/e7350264d22d000d0561d3278ee1b1ecbc814061))
* unwrap { data, metadata } envelope from API response ([91308ed](https://github.com/Transport-for-the-North/vis-core/commit/91308ed1b1073017827193f1cc457153f49cb305))
* **useFetchVisualisationData:** prevent double debounce on data fetch ([50e61e3](https://github.com/Transport-for-the-North/vis-core/commit/50e61e3592e27c8224fc3c5cc97b348111ffaf6d))
* **useMetadataDrivenFilters:** prevent stale cache ([dd80223](https://github.com/Transport-for-the-North/vis-core/commit/dd8022316ded98c213888c45cbf08567f6c5c683))


### Features

* add comparator line and axis label support to LineSeriesChart ([0472cb0](https://github.com/Transport-for-the-North/vis-core/commit/0472cb09036b8ebef01da0ee6b52c5d06e9581ec))
* add DM comparison line to time-series charts ([50d8d5c](https://github.com/Transport-for-the-North/vis-core/commit/50d8d5cd4d057728ab76a96f304fba7548edb536))
* add dynamic register scenario button that only renders if registerScenarios.render == true, and if the selected scenario has not got a registration for target app id. ([02aa2a0](https://github.com/Transport-for-the-North/vis-core/commit/02aa2a05c992ca11ad6c474aacf77c2b67c6b1a0))
* add fileUpload capability with csv and excel validation ([b103def](https://github.com/Transport-for-the-North/vis-core/commit/b103defd8c0f5f74c3140105c7018121c3780946))
* adding configurable web form capability with preview map for coordinate input ([02eed0a](https://github.com/Transport-for-the-North/vis-core/commit/02eed0acd0cf0efcc666367aec9f83b17ea5ce2a))
* allow apps to override TfN logo click URL via appContext ([424e611](https://github.com/Transport-for-the-North/vis-core/commit/424e6113938182e7a95cc85bd2c55c64a21b0021))
* allow dropdown options to be sorted by a custom column ([1b3ed2c](https://github.com/Transport-for-the-North/vis-core/commit/1b3ed2cc9b99992d11df29206410fe22577b7bab))
* cache metadata tables locally across pages ([0a724be](https://github.com/Transport-for-the-North/vis-core/commit/0a724be0cb20dcb08eb5b0d7f60222dc1c181674))
* **CalloutCard:** add card update signals in UI ([e7e11f6](https://github.com/Transport-for-the-North/vis-core/commit/e7e11f6ac62ab8a8027cdc197beb016306e85c56))
* improve map page initial render performance and fix related layer crashes ([918d19b](https://github.com/Transport-for-the-North/vis-core/commit/918d19b07a7f78369f177dd881a8fba2aea2bb02))
* make dynamic legend default display mode configurable ([e8e3357](https://github.com/Transport-for-the-North/vis-core/commit/e8e33570ad25218acb28a13e9d005b7c32fe9c08))
* **MapLayout:** debounce filter state updates so that all actions (update parameterised layer etc) trigger at the same time. ([9fd65ee](https://github.com/Transport-for-the-North/vis-core/commit/9fd65eec0349cb01ac2d8f69e8916e42b1b1bd7f))
* move button to sidebar entry.  added element where if user presses button to register it states if successfully done. ([4e9bcf2](https://github.com/Transport-for-the-North/vis-core/commit/4e9bcf2dcf07a323d735466d6261e97fed191661))
* **notifications:** add global toast notification system ([167c65f](https://github.com/Transport-for-the-North/vis-core/commit/167c65f95139fb9c0c5e030c4aa11a783b66aba3))
* redirect TfN logo to main TfN website ([3e44482](https://github.com/Transport-for-the-North/vis-core/commit/3e4448293c9adf5e856513bb9e77f5bd0000a298))
* support prefilled and hidden fields in DynamicForm ([68f60c1](https://github.com/Transport-for-the-North/vis-core/commit/68f60c174d0d01e3ad7c0ca51821f51892ccf878))
* support time-series array data in line charts ([36e125d](https://github.com/Transport-for-the-North/vis-core/commit/36e125dbb7f7d4511497493b6f48475d6259a7ef))
* **ui:** add stripTrailingZeroes param to formatNumber ([9026a1d](https://github.com/Transport-for-the-North/vis-core/commit/9026a1d75b8c1589475c1ea7a074dfc236f0ed97))

# [0.11.0](https://github.com/Transport-for-the-North/vis-core/compare/v0.10.0...v0.11.0) (2026-05-22)


### Bug Fixes

* **classificationMethods:** ensure Jenks is mathematically possible to prevent error ([bbd9e7f](https://github.com/Transport-for-the-North/vis-core/commit/bbd9e7fa79a40d72a9f910964780dd4a54cffce7))
* **DynamicLegend:** address snags ([f4bd30a](https://github.com/Transport-for-the-North/vis-core/commit/f4bd30a2b0a48d64de6faa186dc26645e2a03077))
* **DynamicLegend:** allow custombands below 0 ([7c7fe0c](https://github.com/Transport-for-the-North/vis-core/commit/7c7fe0c8f2f00ef9de8f81443db379e4285e0811))
* **DynamicLegend:** debounce out-of-band flags to prevent flashing during rapid updates ([07b5f4c](https://github.com/Transport-for-the-North/vis-core/commit/07b5f4ce04e93a48644b676cd49278e058e7f68b))
* **DynamicLegend:** ensure no LegendDivider on mobile ([4e556d7](https://github.com/Transport-for-the-North/vis-core/commit/4e556d7ee3a8a031a2bcf02f85b2d1f003505aaa))
* **DynamicLegend:** improve rounding to prevent data going out of bounds ([ea47fcb](https://github.com/Transport-for-the-North/vis-core/commit/ea47fcbd06d8b62102d08be0552b5d2dca6dce93))
* **DynamicLegend:** improve tick mark rendering and label positioning in ContinuousGradientBar ([b49bd36](https://github.com/Transport-for-the-North/vis-core/commit/b49bd36d54a9f422d2a1edd94c22ad764aa07f8b))
* **DynamicLegend:** increase z-index of LegendContainer to prevent tooltip occlusion by CalloutCard panels ([d92eb5e](https://github.com/Transport-for-the-North/vis-core/commit/d92eb5e5e136b0cf9e8a3f8e74437ba83c78fe0a))
* **DynamicLegend:** remove maxPrecision from axis labels to prevent 10dp ([39380fb](https://github.com/Transport-for-the-North/vis-core/commit/39380fb45b879ba5a2fe1f568aa36cda5f959941))
* fix custom banding to not trigger out of band message when it is within range (this was due to upgrade to formatNumber therefore it was assuming 150K was 150 etc). also fix so when manually selecting custom, the user can updating banding. ([95e9379](https://github.com/Transport-for-the-North/vis-core/commit/95e9379ae655fd235db5043d498043120a01da84))
* **reclassifyData:** comment out buggy handling of custom bands for continuous classification ([a62b3e1](https://github.com/Transport-for-the-North/vis-core/commit/a62b3e132d753261fc16f925317aae3009da5afd))
* remove functionality that should not exist in layer control entry (was a previously attempt at implementation) ([10f7704](https://github.com/Transport-for-the-North/vis-core/commit/10f7704ed7f13cbe83c1fd711efac7aac6a59cca))


### Features

* **DynamicLegend:** add AnnotationRow and SwatchAnnotation styled components ([e2c5a7b](https://github.com/Transport-for-the-North/vis-core/commit/e2c5a7b5148efc886dd99178bd4832b5576d026c))
* **DynamicLegend:** add dynamic width tracks for circles and lines in ContinuousGradientBar ([24e2045](https://github.com/Transport-for-the-North/vis-core/commit/24e2045e20cf2e2e6a2b83a897a160a9ef5ef5a7))
* **DynamicLegend:** Add gradient colour bar for legend ([#206](https://github.com/Transport-for-the-North/vis-core/issues/206)). ([2a6ed8e](https://github.com/Transport-for-the-North/vis-core/commit/2a6ed8eca105b2d6ee1b444f335173c25253761b))
* **DynamicLegend:** add LegendNumberFormat typedef and formatLegendNumber utility ([bf7ac20](https://github.com/Transport-for-the-North/vis-core/commit/bf7ac20204176470c1b148f786aecd7601c9dde3))
* **DynamicLegend:** add suffix and prefix to value labels to signify values outside bands ([7462329](https://github.com/Transport-for-the-North/vis-core/commit/7462329a9d7db6369579ebd23fed97e083797a47))
* **DynamicLegend:** enhance ContinuousGradientBar with dynamic side padding and update CircleTrack positioning ([8e65de3](https://github.com/Transport-for-the-North/vis-core/commit/8e65de3525873ccc1df199f4f16cf85e5cb7586a))
* **DynamicLegend:** persist user display preferences in localStorage and close popover on selection ([bdc7445](https://github.com/Transport-for-the-North/vis-core/commit/bdc7445c7b1539742d9470c58db7dcffcb34bec1))
* **DynamicLegend:** render annotations and apply formatLegendNumber across legend views ([fdc3d77](https://github.com/Transport-for-the-North/vis-core/commit/fdc3d77c3523af0211a35121f211dbe9ce94da03))
* implement default width factor with tests, successful and working. ([cad6656](https://github.com/Transport-for-the-North/vis-core/commit/cad665609ceaca46141d5d924a06367ff668fd7f))
* **MessageBox:** add overrides for MessageBox derivatives for margin and text size ([51443e1](https://github.com/Transport-for-the-North/vis-core/commit/51443e151d5208e90186ece204fa287d36c7eda4))

# [0.10.0](https://github.com/Transport-for-the-North/vis-core/compare/v0.9.1...v0.10.0) (2026-04-29)


### Bug Fixes

* allow single selection to feed through to filterState. ([f5f840f](https://github.com/Transport-for-the-North/vis-core/commit/f5f840fdc21e953388fc82109dfcaafe24eb3b83))
* change text colours to rgb so that tests pass. ([d62b236](https://github.com/Transport-for-the-North/vis-core/commit/d62b236b1089c2718226fba34fd7959fb8321042))
* needed a commit message so made a note of TODO in readme ([bd5acd5](https://github.com/Transport-for-the-North/vis-core/commit/bd5acd5b14594f22f2e58f658321dab3a584bcf0))
* prevent undefined prefix on burger button image src ([d133112](https://github.com/Transport-for-the-North/vis-core/commit/d1331122504d7f545132dc9d4cc003458aba55e0))
* remove uncomputable style assertion in Sidebar Firefox test ([3321067](https://github.com/Transport-for-the-North/vis-core/commit/3321067fd13873411dcd2779e3f2163ef14548da))
* update style assertions in MapFeatureSelect test to match jsdom output ([50f2286](https://github.com/Transport-for-the-North/vis-core/commit/50f228694b41a51d8e090257e81d81724d6e5520))


### Features

* add error overlay where filters are empty. remove clearing of error context in useFetchVisualisationData. ([e1e4009](https://github.com/Transport-for-the-North/vis-core/commit/e1e40099909d4f37c697f91a0924ab079e97a51e))
* Add unit tests for Base App ([103f5d3](https://github.com/Transport-for-the-North/vis-core/commit/103f5d338d9434508ecb4b6cd61d2a6e90e00c7a))
* categorical colour states added with tests. ([24f3e58](https://github.com/Transport-for-the-North/vis-core/commit/24f3e58cc30fa7341e0643cd802c2aefdbc73fca))
* support defaultClassification in visualisation config ([52000ab](https://github.com/Transport-for-the-North/vis-core/commit/52000ab20c6a572ea1284fc98e2b5674fbd18616))
* update to baseapp which now uses the loadBands from the util. ([807e406](https://github.com/Transport-for-the-North/vis-core/commit/807e406eca79710e0260d5fd8ee2ceb5c40911c5))
* use formatNumber for legends ([5d5d060](https://github.com/Transport-for-the-North/vis-core/commit/5d5d060c224791c439743d590acf00f929c23555))

## [0.9.1](https://github.com/Transport-for-the-North/vis-core/compare/v0.9.0...v0.9.1) (2026-04-02)


### Bug Fixes

* improve navbar dropdown hover stability and transitions ([3bed942](https://github.com/Transport-for-the-North/vis-core/commit/3bed9423030eff630447a920a5fe1da5b96475d3))

# [0.9.0](https://github.com/Transport-for-the-North/vis-core/compare/v0.8.0...v0.9.0) (2026-04-02)


### Bug Fixes

* add back in resizer button, have it positioned next to new column splitters so everything is aligned. ([3597ae9](https://github.com/Transport-for-the-North/vis-core/commit/3597ae986a69556101d479fe933f2c5c1b934118))
* band editor improvements, added section divider to layer control entry to allow for better splitting, as it was a little bit messy before. ([fa07a92](https://github.com/Transport-for-the-North/vis-core/commit/fa07a922c95c392b1f479c4d3de798a257787271))
* bands treated as lower bounds for each class. ([99d9de9](https://github.com/Transport-for-the-North/vis-core/commit/99d9de9e120fa2aa5eb72ac1cab44ba412d9d2fe))
* **ColourSchemeDropdown:** add optional chaining to prevent errors when accessing layer color scheme ([3a6eb15](https://github.com/Transport-for-the-North/vis-core/commit/3a6eb15184e9575c9eeda7ca24c8ed4db105e61b))
* complete rehaul of the svg page to be aligned with SVGGalleryManager, remove of dup functions, alignment with hooks in the application, styling now uses app-wide styling. Documentation updated. ([e736eb5](https://github.com/Transport-for-the-North/vis-core/commit/e736eb52fde5a6459bd0599f39d536744114f6fc))
* data table top bar by adding grid element. ([3897e7a](https://github.com/Transport-for-the-North/vis-core/commit/3897e7a874a7c6ec508da9df1d4702b2a94e23c4))
* fix issue where it does not update on subsequent updates. ([10b5784](https://github.com/Transport-for-the-North/vis-core/commit/10b5784e1e0fa9b35b7a94dd4f0cd8f8f00e7474))
* left align all text, clear out filters when new card is created, fix up caveat box ([f589eed](https://github.com/Transport-for-the-North/vis-core/commit/f589eed32870d96c6bd2ecdad6a799de15ea92bc))
* **number formatting:** ensure formatted numbers include commas and two decimal places ([1c92b4c](https://github.com/Transport-for-the-North/vis-core/commit/1c92b4c067bcf8c744bd7fa9ed7c46108b40f87a))
* remove filter/match showing for caveats and legend, have them always visible. ([163b688](https://github.com/Transport-for-the-North/vis-core/commit/163b688e8e5fe05c551be856d4865c7f89498a52))
* remove node only expression in showWidth and standardise everything to shouldFixLineWidth ([341010c](https://github.com/Transport-for-the-North/vis-core/commit/341010c9f2a4f253b6dea236b4a5055e528123f3))
* remove SvgPage references. ([3d16600](https://github.com/Transport-for-the-North/vis-core/commit/3d166005d1faf432afc31d19e45655b3b560c38a))
* rename legendText in this case to unitText as this makes more common sense. ([ef7dcef](https://github.com/Transport-for-the-North/vis-core/commit/ef7dcef3cf9222048068b88a9d8f7085a2d35823))
* **SvgGalleryManager:** exclude fixed filters from selected label mapping ([d9e7608](https://github.com/Transport-for-the-North/vis-core/commit/d9e760809a1c4bfcdbb624a91b37a7bfc90ec7d9))


### Features

* add layer config tooltip value/legend texts. ([943237f](https://github.com/Transport-for-the-North/vis-core/commit/943237f09f9ae36465a89ca34fe1836ba39f00e2))
* add warn if fixedLineWidth exists and shouldFixLineWidth does not. ([eaa0094](https://github.com/Transport-for-the-North/vis-core/commit/eaa0094ec1e286f619e9051d1ce14d8fe653b7c4))
* add warning box with text when no selectable options. align all column texts and splitters. when hover, non-selectables will display a "not allowed" icon, identiying that it is not selectable. ([1b57588](https://github.com/Transport-for-the-North/vis-core/commit/1b57588c84ff0c289c1ffd898ac783665383a87d))
* added so that fixed filters are not visible. ([19091e3](https://github.com/Transport-for-the-North/vis-core/commit/19091e3eabb4fa6d4a4a49c683951023f34003ec))
* Alistair requested updates, removed some logs and aligning the editor with the changing of other map layer controls. ([4c16cc3](https://github.com/Transport-for-the-North/vis-core/commit/4c16cc3c5f8f7859957f95819cfcb9c962d6cd52))
* enforce no custom banding onto specified layers if in layer config. ([c5f8f0d](https://github.com/Transport-for-the-North/vis-core/commit/c5f8f0d8a44ce3b1f19fb1bb6262328d11fb9997))
* implement fixed line width logic based on page config entry. ([6f46278](https://github.com/Transport-for-the-North/vis-core/commit/6f462789ed2a9aa015df721c30897e38dfa59373))
* implement smart number formatting utility in formatNumber ([3597b75](https://github.com/Transport-for-the-North/vis-core/commit/3597b75221c723cbee0fd0cd01a64df0ccdb7d98))
* integrate unit tests into CI/CD pipeline ([0372642](https://github.com/Transport-for-the-North/vis-core/commit/037264257152fa04f53e41e24fcc9fd4d878b789))
* remove scientific notation and automate continuous first band to be zero. ([810da80](https://github.com/Transport-for-the-North/vis-core/commit/810da80078759c8dda1a2ee54e0430ced716577a))
* show initial list of features on zoom to map dropdown open ([69d0c88](https://github.com/Transport-for-the-North/vis-core/commit/69d0c8866bc28201586f8cfc67d332a25f676170))
* **spider:** add spiderfier functionality for coincident points ([7a1cdcd](https://github.com/Transport-for-the-North/vis-core/commit/7a1cdcde1a7841d2da850c1c381049c718960402))
* **SvgGalleryManager:** integrate footer component from app context ([a035d0b](https://github.com/Transport-for-the-North/vis-core/commit/a035d0b69740f43ff5183932ffba268874934bd0))
* use formatNumber across ChartRenderer chart types ([ba0cde3](https://github.com/Transport-for-the-North/vis-core/commit/ba0cde3714fe2b12f3cd6b82cdf3a7c17bbc31ea))
* use formatNumber for map tooltip value display ([4cb6c86](https://github.com/Transport-for-the-North/vis-core/commit/4cb6c86ebfe9160b0aed37afff3da00273e28620))
