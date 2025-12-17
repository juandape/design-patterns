import { IVehicle } from './Vehicle';

export const calculateTripCost = (
  vehicle: IVehicle,
  distance: number
): string => {
  const cost = vehicle.calculateTripCost(distance);
  const message = `The trip cost for ${vehicle.name} is $${cost}`;
  console.log(message);
  return message;
};
