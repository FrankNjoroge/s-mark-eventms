const handleMpesaCallback = (req, res) => {
  console.log("Mpesa Callback Data:", req.body);
  res.status(200).send("Callback Received");
};

export { handleMpesaCallback };
