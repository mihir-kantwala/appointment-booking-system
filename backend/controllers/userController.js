import {
  getAllServices,
  getAllSlots,
  userBookedAslot,
} from '../services/getService.js';

const getServices = async (req, res) => {
  try {
    const service = await getAllServices();

    res.status(200).json({
      success: true,
      message: 'service fetched',
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

const getSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    const slots = await getAllSlots(serviceId, date);
    res.status(200).json({
      success: true,
      message: 'slots fetched',
      slots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

const bookedASlot = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const bookedSlot = await userBookedAslot(data);

    res.status(200).json({
      success: true,
      message: 'slots booked',
      bookedSlot,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

export { getServices, getSlots, bookedASlot };
