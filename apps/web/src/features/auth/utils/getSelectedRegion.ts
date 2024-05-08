import type { Regions } from "@authFeat/typings/Region";

export default function getSelectedRegion(
  regions: Regions[],
  countryName: string
) {
  const region = regions.find((region) => region.countryName === countryName);

  if (region) {
    return region.regions;
  } else {
    return "No regions was found from your selected country, you can skip this step.";
  }
}
