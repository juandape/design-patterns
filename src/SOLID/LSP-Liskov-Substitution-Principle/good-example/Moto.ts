import { IVehicle } from "./Vehicle";

export const Moto: IVehicle = {
  name: "Moto",
  calculateTripCost(distance: number): number {
    return distance * 1.2;
  }
}