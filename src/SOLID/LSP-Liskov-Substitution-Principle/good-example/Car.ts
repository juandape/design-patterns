import { IVehicle } from "./Vehicle";

export const Car: IVehicle = {
  name: "Car",
  calculateTripCost(distance: number): number {
    return distance * 2.5;
  }
}