export interface RoiInput {
  rooms: number;
  adr: number;
  occupancy: number;
  otaShare: number;
}

export interface RoiResult {
  monthlyRevenue: number;
  otaCommission: number;
  directSavings: number;
  errorRecovery: number;
  totalRecovery: number;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const { rooms, adr, occupancy, otaShare } = input;
  const rev = rooms * adr * (occupancy / 100) * 30;
  const comm = rev * (otaShare / 100) * 0.18;
  const direct = rev * (Math.min(15, otaShare) / 100) * 0.18;
  const err = rev * 0.015;
  return {
    monthlyRevenue: rev,
    otaCommission: comm,
    directSavings: direct,
    errorRecovery: err,
    totalRecovery: direct + err,
  };
}
