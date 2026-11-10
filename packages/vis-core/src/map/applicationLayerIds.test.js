import { getApplicationLayerRootId, isConfiguredApplicationLayer } from "./applicationLayerIds";

describe("getApplicationLayerRootId", () => {
  it.each([
    ["Links-hover", "Links"],
    ["Links-select", "Links"],
    ["Links-select-inner", "Links"],
    ["Stations-spider", "Stations"],
    ["Links", "Links"],
  ])("maps %s to its parent layer %s", (layerId, rootId) => {
    expect(getApplicationLayerRootId(layerId)).toBe(rootId);
  });

  it("treats a select-inner layer as part of its configured parent", () => {
    expect(isConfiguredApplicationLayer({ id: "Zones-select-inner" }, { Zones: {} })).toBe(true);
  });
});
