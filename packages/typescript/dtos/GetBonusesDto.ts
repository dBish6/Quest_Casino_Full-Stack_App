export interface Bonus {
  title: string;
  multiplier: number;
  cap: number;
}

export interface GetBonusesResponseDto {
  bonuses: Bonus[];
  renew: string;
}
