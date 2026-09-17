export const calculateBookingTotal = ({ basePrice, date, participants }) => {
  let total = basePrice * participants;

  let discount = 0;
  let surcharge = 0;

  // 5 or more participants = 10% discount
  if (participants >= 5) {
    discount = total * 0.1;
    total = total - discount;
  }

  // Weekend = 15% surcharge
  const day = new Date(date).getDay();

  if (day === 0 || day === 6) {
    surcharge = total * 0.15;
    total = total + surcharge;
  }

  return {
    discount: Math.round(discount),
    surcharge: Math.round(surcharge),
    total: Math.round(total),
  };
};
