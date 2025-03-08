import type Country from "@qc/typescript/typings/Country";
import type { Region, Regions } from "@authFeat/typings/Region";

import { useEffect, useState } from "react";

import { useLazyGetCountriesQuery, useLazyGetRegionsQuery } from "@services/api";

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
      countries: Country[] | string | null;
      regions: Regions[];
    }>({ countries: null, regions: [] }),
    [selected, setSelected] = useState<{
      country: string;
      regions: Region[] | string;
    }>({ country: defaultSelected?.country || "", regions: [] });

  const [fetchRegions] = useLazyGetRegionsQuery(),
    [fetchCountries] = useLazyGetCountriesQuery();

  const getCountries = async () => {
    if (!worldData.countries?.length) {
      setWorldData((prev) => ({ ...prev, countries: [] }));

      try {
        const countries = (await fetchCountries(undefined, true).unwrap())?.countries;
        setWorldData((prev) => ({ ...prev, countries }));
      } catch (error) {
        setWorldData((prev) => ({
          ...prev,
          countries: "Unexpected error occurred, couldn't find any countries."
        }));
      }
    }
  };

  const getRegions = async () => {
    if (!worldData.regions?.length) {
      setWorldData((prev) => ({ ...prev, regions: [] }));

      try {
        const regions = (await fetchRegions(undefined, true).unwrap())?.regions;
        setWorldData((prev) => ({ ...prev, regions }));
      } catch (error) {
        setSelected((prev) => ({
          ...prev,
          regions: "Unexpected error occurred, couldn't find any regions."
        }));
      }
    }
  };

  useEffect(() => {
    if (defaultSelected?.country) getRegions();
  }, [defaultSelected?.country]);

  useEffect(() => {
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
