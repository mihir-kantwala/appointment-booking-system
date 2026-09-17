import Booking from '../models/Booking.js';
import Service from '../models/Services.js';
import Slot from '../models/Slots.js';
import { calculateTotal } from '../utils/bookingPriceTotal.js';

export const getAllServices = async () => {
  try {
    const services = await Service.find();
    if (!services) {
      throw new Error('service not avilable Services');
    }

    return services;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSlots = async (serviceId, date) => {
  try {
    const slots = await Slot.find({ serviceId: serviceId, date: date });
    if (!slots) {
      throw new Error('slots not avilbel');
    }
    return slots;
  } catch (error) {
    console.log(error);
  }
};

export const userBookedAslot = async (data) => {
  try {
    const totalPrice = await calculateTotal(data.participants, data.serviceId);

    console.log(totalPrice);

    const bookedSlot = await Booking.create({
      serviceId: data.serviceId,
      slotId: data.slotId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      participants: data.participants,
      totalPrice,
    });

    if (!bookedSlot) {
      throw new Error('failed to book a slot');
    }

    const updateSlot = await Slot.findByIdAndUpdate(data.slotId, {
      $inc: { capacity: `-${data.participants}` },
    });

    if (!updateSlot) {
      throw new Error('error updating slot');
    }

    return bookedSlot;
  } catch (error) {
    console.log(error);
  }
};
