import type { Country } from "@qc/constants";
import type { Region, Regions } from "@authFeat/typings/Region";

import { useEffect, useState } from "react";

function getSelectedRegion(
  regions: Regions[],
  countryName: string,
  setError?: any
) {
  const region = regions.find((region) => region.countryName === countryName);

  if (region) {
    return region.regions;
  } else {
    const errorMsg =
      "No regions was found from your selected country, you can skip this step.";

    setError && setError(errorMsg);
    return errorMsg;
  }
}

export default function useWorldData(
  setError: React.Dispatch<any> | ((key: any, value: string) => void),
  defaultSelected?: { country?: string; }
) {
  const [worldData, setWorldData] = useState<{
    countries: Country[] | null;
    regions: Regions[];
  }>({ countries: null, regions: [] }),
  [selected, setSelected] = useState<{
    country: string;
    regions: Region[] | string;
  }>({ country: defaultSelected?.country || "", regions: [] });

  const getCountries = async () => {
    if (!worldData.countries?.length) {
      setWorldData((prev) => ({
        ...prev,
        countries: []
      }));
      const { COUNTRIES } = await import("@qc/constants");
      setWorldData((prev) => ({
        ...prev,
        countries: COUNTRIES
      }));
    }
  };

  const getRegions = async () => {
    if (!worldData.regions?.length) {
      setWorldData((prev) => ({
        ...prev,
        regions: []
      }));
      const regionsData = (await import("@authFeat/constants/REGIONS")).default;
      setWorldData((prev) => ({
        ...prev,
        regions: regionsData
      }));
    }
  };

  useEffect(() => {
    if (defaultSelected?.country) getRegions();
  }, [defaultSelected?.country]);

  useEffect(() => {
    console.log("worldData.regions", worldData.regions)

    if (selected.country && worldData.regions?.length) {
      setSelected((prev) => ({
        ...prev,
        regions: getSelectedRegion(
          worldData.regions,
          selected.country,
          setError
        )
      }));
    }
  }, [selected.country, worldData.regions]);

  return {
    worldData,
    setWorldData,
    selected,
    setSelected,
    getCountries,
    getRegions,
    loading: {
      countries: !!worldData.countries && !worldData.countries.length,
      regions: !!selected.country && !selected.regions.length
    }
  };
}
