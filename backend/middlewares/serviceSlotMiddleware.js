import Booking from '../models/Booking.js';
import Service from '../models/Services.js';
import Slot from '../models/Slots.js';

export const serviecSlotExist = async (req, res, next) => {
  const { serviceId, slotId, customerEmail, participants } = req.body;
  const serviceExist = await Service.findById(serviceId);

  if (!serviceExist) {
    return res.status(400).json({
      success: true,
      message: "Service doesn't exist",
    });
  } else {
    console.log('service exist');
  }

  const slotExist = await Slot.findById(slotId);
  console.log(slotExist);
  console.log(participants);

  if (!slotExist) {
    return res.status(200).json({
      success: true,
      message: 'Slot you are trying to book not exists',
    });
  } else {
    console.log('slot exist');
  }

  if (slotExist.capacity < participants) {
    return res.status(200).json({
      success: true,
      message: 'not euogh slot avilable',
    });
  } else {
    console.log('slot avilabel');
  }

  const emailExist = await Booking.findOne({
    serviceId: serviceId,
    slotId: slotId,
    customerEmail: customerEmail,
  });

  if (emailExist) {
    return res.status(200).json({
      success: true,
      message: 'this email ID alredy booked this slot',
    });
  } else {
    console.log('booking avilabe');
  }

  next();
};
