import { IVehicle } from './Vehicle';

export const Bike: IVehicle = {
  name: 'Bike',
  calculateTripCost(distance: number): number {
    return distance * 0.5;
  },
};
