const axios = require("axios");
const { getMpesaToken } = require("../services/mpesaService");

const lipaNaMpesa = async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const token = await getMpesaToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "Event Payment",
      TransactionDesc: "Payment for event ticket",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Mpesa STK Push Error:", error);
    res.status(500).json({ error: "Mpesa payment failed" });
  }
};

module.exports = { lipaNaMpesa };
