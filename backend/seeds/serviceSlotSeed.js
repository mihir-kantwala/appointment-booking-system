import mongoose from 'mongoose';
import Service from '../models/Services.js';
import Slot from '../models/Slots.js';

import dotenv from 'dotenv';

dotenv.config({
  path: '../.env',
});

const services = [
  { name: 'Hair-Cut only', basePrice: 500, durationMinutes: 30 },
  { name: 'Hair-Cut / beard', basePrice: 700, durationMinutes: 60 },
  { name: 'Face Massage', basePrice: 500, durationMinutes: 30 },
  { name: 'nails Cleaning', basePrice: 500, durationMinutes: 60 },
  { name: 'wedding makeup', basePrice: 500, durationMinutes: 120 },
];

const slots = [
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
];

const serviceSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'finalPractice' });
    console.log('mongoDB is connected');

    for (const serviceData of services) {
      const created = await Service.findOneAndUpdate(
        { name: serviceData.name },
        {
          name: serviceData.name,
          basePrice: serviceData.basePrice,
          durationMinutes: serviceData.durationMinutes,
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
      );
      serviceData._id = created._id;
      console.log(services);
    }

    const date = new Date();

    for (let i = 1; i < 7; i++) {
      console.log(date);

      for (const serviceData of services) {
        for (const slotData of slots) {
          await Slot.findOneAndUpdate({
            serviceId: serviceData._id,
            date: date.toLocaleDateString(),
            time: slotData,
            capacity: 20,
          });
        }
      }

      date.setDate(date.getDate() + 1);
    }
    console.log('slot craeted');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

serviceSeed();
