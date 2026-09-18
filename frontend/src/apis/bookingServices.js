const API_URI = 'http://localhost:5000/api';

export const getServiceFromBackend = async () => {
  try {
    const res = await fetch(`${API_URI}/services`, {
      method: 'GET',
    });
    const data = await res.json();
    // if (!data.ok) {
    //   // throw new Error(data.message || 'Error fetching Services');
    // }
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getSlotsFromBackend = async (serviceId, date) => {
  const [year, month, day] = date.split('-');
  const formatedDate = `${Number(day)}/${Number(month)}/${year}`;

  console.log(serviceId, formatedDate);

  try {
    const res = await fetch(
      `${API_URI}/slots?serviceId=${serviceId}&date=${formatedDate}`,
      {
        method: 'GET',
      },
    );
    // console.log(res);

    const data = await res.json();
    console.log(data);

    // if (!data.ok) {
    //   throw new Error(data.message || 'Error fetching Services');
    // }
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const bookSlot = async (formData) => {
  try {
    const res = await fetch(`${API_URI}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);

    // if (!data.ok) {
    //   throw new Error(data.message || 'Error fetching Services');
    // }
    return data;
  } catch (error) {
    console.log(error);
  }
};
