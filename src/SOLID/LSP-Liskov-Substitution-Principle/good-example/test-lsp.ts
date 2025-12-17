import { Bike } from './Bike';
import { Car } from './Car';
import { Moto } from './Moto';
import { calculateTripCost } from './TripCostCalculator';

try {
  const cost = calculateTripCost(Car, 100);
  console.log(`The trip cost for Car is $${cost}`);
} catch {
  console.log('An error occurred while calculating the trip cost by Car.');
}

try {
  const cost = calculateTripCost(Bike, 50);
  console.log(`The trip cost for Bike is $${cost}`);
} catch {
  console.log('An error occurred while calculating the trip cost by Bike.');
}

try {
  const cost = calculateTripCost(Moto, 75);
  console.log(`The trip cost for Moto is $${cost}`);
} catch {
  console.log('An error occurred while calculating the trip cost by Moto.');
}
