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
