const axios = require("axios");

const getMpesaToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Mpesa Auth Error:", error);
    throw new Error("Failed to get Mpesa token");
  }
};
const reverseMpesaTransaction = async (transactionId, amount) => {
  try {
    const token = await getMpesaToken();

    const payload = {
      Initiator: process.env.MPESA_INITIATOR_NAME, // The API user (should be set up in Mpesa portal)
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL, // Encrypted password
      CommandID: "TransactionReversal",
      TransactionID: transactionId, // The original transaction ID
      Amount: amount, // Amount to reverse
      ReceiverParty: process.env.MPESA_SHORTCODE, // Your business shortcode
      RecieverIdentifierType: 11, // 11 for Paybill, 4 for Till
      ResultURL: process.env.REVERSAL_CALLBACK_URL, // URL to receive Mpesa response
      QueueTimeOutURL: process.env.REVERSAL_TIMEOUT_URL,
      Remarks: "Reversal request",
      Occasion: "Mistaken transaction",
    };
    console.log("Payload:", payload);

    const response = await axios.post(process.env.MPESA_REVERSAL_URL, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Mpesa Reversal Error:", error);
    throw new Error("Failed to initiate reversal");
  }
};

module.exports = { getMpesaToken, reverseMpesaTransaction };
