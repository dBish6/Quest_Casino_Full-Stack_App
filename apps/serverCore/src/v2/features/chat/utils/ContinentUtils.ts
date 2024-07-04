import { type Country, COUNTRIES } from "@qc/constants";

const CONTINENTS: ReadonlySet<string> = new Set(["North America", "South America", "Europe", "Asia", "Africa", "Oceania", "Antarctica"]) // prettier-ignore

class ContinentUtils {
  //   includes(continent: string) {
  //     return COUNTRIES.some((country) => country.name === continent);
  //   }
  // TODO: Make better.
  getContinentByCountry(country: string) {
    return COUNTRIES.find((x) => x.name === country)?.continent;
  }

  isContinent(continent: string) {
    return CONTINENTS.has(continent);
  }
}

const continentUtils = new ContinentUtils();
export default continentUtils;
