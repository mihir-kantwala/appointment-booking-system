import { useEffect, useState } from 'react';
import {
  bookSlot,
  getServiceFromBackend,
  getSlotsFromBackend,
} from '../apis/bookingServices';
import { calculateBookingTotal } from '../utils/bookingCalculation';

export default function BookingPage() {
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotsForm, setSlotsForm] = useState({
    serviceId: '',
    date: '',
  });

  const [calculateTotal, setCalculateTotal] = useState({
    basePrice: '',
    date: '',
    participants: '',
    discount: '',
    surcharge: '',
    total: '',
  });

  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    slotId: '',
    customerEmail: '',
    customerName: '',
    participants: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getServiceFromBackend();
      setServices(result.service);
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      const selectedService = services.find((service) => service._id === value);

      // Reset date and fetched slots
      setSlotsForm({
        serviceId: value,
        date: '',
      });

      // Reset selected slot and booking-related data
      setBookingForm({
        serviceId: value,
        slotId: '',
        customerEmail: '',
        customerName: '',
        participants: '',
      });
      setCalculateTotal({
        basePrice: selectedService?.basePrice || 0,
        date: '',
        participants: '',
        total: '',
      });

      // Remove old slots from UI
      setSlots([]);

      return;
    }

    if (name === 'date') {
      setSlots([]);

      setCalculateTotal((prev) => ({
        ...prev,
        date: value,
      }));
    }

    setSlotsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: name === 'participants' ? Number(value) : value,
    }));

    if (name === 'participants') {
      setCalculateTotal((prev) => ({
        ...prev,
        participants: Number(value),
      }));
    }
  };

  useEffect(() => {
    if (
      calculateTotal.basePrice &&
      calculateTotal.date &&
      calculateTotal.participants > 0
    ) {
      const result = calculateBookingTotal(calculateTotal);
      console.log(result);

      setCalculateTotal((prev) => ({
        ...prev,
        total: result.total,
        discount: result.discount,
        surcharge: result.surcharge,
      }));
    }
  }, [
    calculateTotal.basePrice,
    calculateTotal.date,
    calculateTotal.participants,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slotsForm.serviceId) {
      return alert('Please select a service');
    }

    if (!slotsForm.date) {
      return alert('Please select a date');
    }

    setLoadingSlots(true);

    try {
      const result = await getSlotsFromBackend(
        slotsForm.serviceId,
        slotsForm.date,
      );

      setSlots(result.slots);
    } catch (error) {
      console.error(error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookingFormSubmit = async (e) => {
    e.preventDefault();

    if (!bookingForm.customerName.trim()) {
      return alert('Please enter your name');
    }

    if (!bookingForm.customerEmail.trim()) {
      return alert('Please enter your email');
    }

    if (bookingForm.participants <= 0) {
      return alert('Participants must be greater than 0');
    }

    if (!bookingForm.slotId) {
      return alert('Please select a slot');
    }

    const res = await bookSlot(bookingForm);
    console.log(res);

    alert(res.message || 'slot booked');
  };

  return (
    <div>
      <h1>Appointment booking page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="service">Select Service :</label>
        <select
          id="service"
          name="serviceId"
          value={slotsForm.serviceId}
          onChange={handleChange}
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>

        <label>Select Date : </label>
        <input
          type="date"
          name="date"
          value={slotsForm.date}
          onChange={handleChange}
        />
        <button type="submit" disabled={loadingSlots}>
          {loadingSlots ? 'Loading...' : 'Show Slots'}
        </button>
      </form>

      {slots.length > 0 && (
        <div>
          <h3>Available Slots :</h3>
          <div>
            {slots.map((slot) => (
              <button
                key={slot._id}
                type="button" // prevent default form submit
                name="slotId"
                disabled={slot.remainingCapacity <= 0}
                onClick={() =>
                  setBookingForm((prev) => ({
                    ...prev,
                    slotId: slot._id,
                  }))
                }
                className={bookingForm.slotId === slot._id ? 'selected' : ''}
              >
                <p>{slot.time}</p>
                <p>capacity :{slot.capacity}</p>
                <p>Available: {slot.remainingCapacity}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {bookingForm.slotId && (
        <div>
          <h3>Booking form : </h3>
          <form onSubmit={handleBookingFormSubmit}>
            <label>Enter Name : </label>
            <input
              type="text"
              name="customerName"
              value={bookingForm.customerName}
              onChange={handleBookingFormChange}
            />
            <label>Enter Name : </label>
            <input
              type="email"
              name="customerEmail"
              value={bookingForm.customerEmail}
              onChange={handleBookingFormChange}
            />
            <label>Participants : </label>
            <input
              type="number"
              min="1"
              // max={selectedSlot?.remainingCapacity}
              name="participants"
              value={bookingForm.participants}
              onChange={handleBookingFormChange}
            />

            {calculateTotal.total && (
              <div>
                <p>Participant : {calculateTotal.participants}</p>
                <p>Surcharge : {calculateTotal.surcharge}</p>
                <p>Discount : {calculateTotal.discount}</p>
                <p>total : {calculateTotal.total}</p>
              </div>
            )}

            <button type="submit">Book Slot</button>
          </form>
        </div>
      )}
    </div>
  );
}
