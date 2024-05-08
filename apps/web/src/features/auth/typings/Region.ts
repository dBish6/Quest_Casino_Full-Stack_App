export interface Region {
  name: string;
  abbr?: string;
}

export interface Regions {
  countryName: string;
  abbr: string;
  regions: Region[];
}
