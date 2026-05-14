export const sendResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    statusCode: status,   // 👈 ADD THIS
    message,
    ...(data && { data })
  });
};