export const validateCredentials = (req, res, next) => {
  const { customerEmail, customerName, participants } = req.body;
  console.log(participants);

  if (!customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }
  if (!customerName) {
    return res.status(400).json({
      success: false,
      message: 'Name is required',
    });
  }
  if (!participants) {
    return res.status(400).json({
      success: false,
      message: 'participants shold be more than 0',
    });
  }
  // if (participants === 0) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'participants must be more than 0',
  //   });
  // }

  next();
};
