import Service from '../models/Services.js';

export const calculateTotal = async (participant, serviecId) => {
  const service = await Service.findById(serviecId);

  let total = participant * service.basePrice;

  if (participant > 5) {
    let discount = total * 0.1;
    total -= discount;
  }

  const day = new Date().getDay();

  if (day === 6 || day === 0) {
    let surcharge = total * 0.15;
    total -= surcharge;
  }

  return total;
};
