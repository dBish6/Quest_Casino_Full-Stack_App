import type Country from "@qc/typescript/typings/Country";
import { ApiError } from "./handleError";

const { CDN_URL, PROTOCOL, HOST, PORT } = process.env;

let COUNTRIES_MAP = new Map<string, Country>(),
  promise: Promise<Map<string, Country>> | null = null;

export default async function getCountriesMap() {
  if (COUNTRIES_MAP.size) return COUNTRIES_MAP;

  if (!promise) {
    promise = (async () => {
      const res = await fetch(`${CDN_URL!}/world/countries/countries.json`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Referer: `${PROTOCOL}${HOST}:${PORT}`
          }
        }),
        data: Country[] = await res.json();
        
        if (!res.ok) {
          promise = null;
          throw new ApiError(`Unexpected error occurred, countries fetch failed with status ${res.status}.`);
        }
        
        COUNTRIES_MAP = new Map(data.map((country) => [country.name, country]));
        return COUNTRIES_MAP;
    })();
  }

  return promise;
}
