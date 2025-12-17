export interface IVehicle{
  name: string,
  calculateTripCost(distance: number): number;
}