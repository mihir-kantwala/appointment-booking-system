import { useEffect, useState } from 'react';
import {
  bookSlot,
  getServiceFromBackend,
  getSlotsFromBackend,
} from '../apis/bookingServices';
import { calculateBookingTotal } from '../utils/bookingCalculation';

export default function Booking() {
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  // Used for searching/fetching slots
  const [slotsForm, setSlotsForm] = useState({
    serviceId: '',
    date: '',
  });

  // Used for booking
  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    slotId: '',
    customerEmail: '',
    customerName: '',
    participants: '',
  });

  // Only store calculated values here
  const [price, setPrice] = useState({
    discount: 0,
    surcharge: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getServiceFromBackend();
        setServices(result.service);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When service changes
    if (name === 'serviceId') {
      setSlotsForm({
        serviceId: value,
        date: '',
      });

      setBookingForm({
        serviceId: value,
        slotId: '',
        customerEmail: '',
        customerName: '',
        participants: '',
      });

      setSlots([]);
      setPrice({
        discount: 0,
        surcharge: 0,
        total: 0,
      });

      return;
    }

    // When date changes
    if (name === 'date') {
      setSlots([]);
      setPrice({
        discount: 0,
        surcharge: 0,
        total: 0,
      });
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
  };

  const selectedService = services.find(
    (service) => service._id === bookingForm.serviceId,
  );

  useEffect(() => {
    const basePrice = selectedService?.basePrice;
    const date = slotsForm.date;
    const participants = bookingForm.participants;

    // Don't calculate until all required values exist
    if (!basePrice || !date || !participants || participants <= 0) {
      setPrice({
        discount: 0,
        surcharge: 0,
        total: 0,
      });

      return;
    }

    const result = calculateBookingTotal({
      basePrice,
      date,
      participants,
    });

    setPrice({
      discount: result.discount,
      surcharge: result.surcharge,
      total: result.total,
    });
  }, [selectedService, slotsForm.date, bookingForm.participants]);

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

    const result = await bookSlot({
      ...bookingForm,
      totalPrice: price.total,
    });

    console.log(result);

    alert(result.message || 'Slot booked');
  };

  return (
    <div>
      <h1>Appointment Booking Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="service">Select Service:</label>
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
        <label htmlFor="date">Select Date:</label>
        <input
          id="date"
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
          <h3>Available Slots:</h3>
          {slots.map((slot) => (
            <button
              key={slot._id}
              type="button"
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
              <p>Capacity: {slot.capacity}</p>
              <p>Available: {slot.remainingCapacity}</p>
            </button>
          ))}
        </div>
      )}

      {bookingForm.slotId && (
        <div>
          <h3>Booking Form</h3>
          <form onSubmit={handleBookingFormSubmit}>
            <label>Enter Name:</label>
            <input
              type="text"
              name="customerName"
              value={bookingForm.customerName}
              onChange={handleBookingFormChange}
            />

            <label>Enter Email:</label>
            <input
              type="email"
              name="customerEmail"
              value={bookingForm.customerEmail}
              onChange={handleBookingFormChange}
            />

            <label>Participants:</label>
            <input
              type="number"
              min="1"
              name="participants"
              value={bookingForm.participants}
              onChange={handleBookingFormChange}
            />

            {bookingForm.participants > 0 && (
              <div>
                <h4>Price Summary</h4>
                <p>Participants: {bookingForm.participants}</p>
                <p>Surcharge: ₹{price.surcharge}</p>
                <p>Discount: ₹{price.discount}</p>
                <p>
                  <strong>Total: ₹{price.total}</strong>
                </p>
              </div>
            )}
            <button type="submit">Book Slot</button>
          </form>
        </div>
      )}
    </div>
  );
}
