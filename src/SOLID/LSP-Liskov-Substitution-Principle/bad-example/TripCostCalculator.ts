type VehicleType = 'car' | 'moto' | 'bike';

interface Vehicle {
  type: VehicleType;
  name: string;
}

export const calculateTripCost = (vehicle: Vehicle, distance: number) => {
  if (vehicle.type === 'car') {
    return distance * 2.5;
  } else if (vehicle.type === 'moto') {
    return distance * 1.2;
  } else if (vehicle.type === 'bike') {
    return distance * 0.5;
  } else {
    throw new Error('Unsupported vehicle type');
  }
};
