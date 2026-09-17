import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Slot_model',
  },
);

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
