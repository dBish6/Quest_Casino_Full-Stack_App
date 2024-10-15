import { COUNTRIES } from "./COUNTRIES";

export const COUNTRIES_MAP = new Map(
  COUNTRIES.map((country) => [country.name, country])
);
