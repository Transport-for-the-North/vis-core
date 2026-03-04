# [0.8.0](https://github.com/Transport-for-the-North/vis-core/compare/v0.7.0...v0.8.0) (2026-03-04)


### Bug Fixes

* add null checks for map instances to prevent errors during layer operations and cleanup ([04bd3bb](https://github.com/Transport-for-the-North/vis-core/commit/04bd3bb6f7c4fa17d7085a5ea3374f6c351bd7f5))
* enable backwards compatibility with error provider ([c32b933](https://github.com/Transport-for-the-North/vis-core/commit/c32b933ea0433028f86670a2890b446a1205f87e))
* enhance retry manager and update feature state handling for improved performance and reliability ([684d7e3](https://github.com/Transport-for-the-North/vis-core/commit/684d7e3c4719656d7a02f716a21ffc7e48e44d78))
* remove errorState from fetch dependency array ([6e9200b](https://github.com/Transport-for-the-North/vis-core/commit/6e9200b6d610c1e087832838ed600be8f0ec132e))
* remove fetch flush to prevent debounce being overridden and multiple requests firing at once ([805c166](https://github.com/Transport-for-the-North/vis-core/commit/805c166fa4e56d345b07b2bd6205d8f80c9298a2))
* shouldShowInLegend functioanlity fixed, tests added to respect this. ([1dbab9c](https://github.com/Transport-for-the-North/vis-core/commit/1dbab9cea6b5f45c242e50ad66c37fdad10a0aa0))


### Features

* add BaseApp component to centralise common app structure ([d2eb5d5](https://github.com/Transport-for-the-North/vis-core/commit/d2eb5d5aeea106fec6a6554b45f11714537ab946))
* Add BaseApp component to centralise common app structure ([9c9ee6e](https://github.com/Transport-for-the-North/vis-core/commit/9c9ee6ec475b72af371eaf8f6326314b036fbc30))
* add spatial helper functions for bounding box calculations and data accumulation logic ([b62a8a6](https://github.com/Transport-for-the-North/vis-core/commit/b62a8a67382efa6b4a8cb81986e5f8d3d0240e1c))
* added error reducer and context and updated mapcontext to call dispatch to error overlay. Also added it to clear on page switch. ([27cef52](https://github.com/Transport-for-the-North/vis-core/commit/27cef520de8257167b2cae031c0a2735fd61a3f4))
* convert vector tile viewport to data-side viewport. updated documentation. change react-maplibre in package.json to 1.6.0 otherwise attempts to look for react 19. ([52b088e](https://github.com/Transport-for-the-North/vis-core/commit/52b088e5a950e74f25f738d0e1c1405608ee9a07))
* **DirectoryScorecardsPage:** add client-side filtering for records endpoint ([853b013](https://github.com/Transport-for-the-North/vis-core/commit/853b01355474608898f523abc4b71b38a41e7159))
* Made the overlay the correct name as it has not updated, removed metadata error as this was outdated and should be one component with dynamic error entries for simplistic implementation. Example for error now added to mapcontext where metadata tables are empty. ([9ff4354](https://github.com/Transport-for-the-North/vis-core/commit/9ff435476a9fb10dbc7bdaf10a2457ff42c2f9ff))
* move error provider to base app and remove from map context. ([d19e923](https://github.com/Transport-for-the-North/vis-core/commit/d19e923941f739d4a6aba81282b63ecfebe54ac2))
* optimise feature state updates by using Maps for diffing and preventing redundant operations ([e4632a4](https://github.com/Transport-for-the-North/vis-core/commit/e4632a4d6d419011bc009d8c706e4955955ecae5))
* tightened import/exports ([f9754c3](https://github.com/Transport-for-the-North/vis-core/commit/f9754c369362e7a664c75f6a233c0195032dd17d))
* Update to allow config bar heights for singular bars. ([401721a](https://github.com/Transport-for-the-North/vis-core/commit/401721aaa67a2e8683a3452f53f752613d9cbba1)), closes [#133](https://github.com/Transport-for-the-North/vis-core/issues/133)
* Updated viewport with API connectivity, documentation also added. ([8c63423](https://github.com/Transport-for-the-North/vis-core/commit/8c6342354cd423e6940765694e6f7d9f833c3c56))
