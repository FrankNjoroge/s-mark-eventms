const express = require("express");
const {
  lipaNaMpesa,
  handleMpesaCallback,
} = require("../controllers/mpesaController.js");

const { reverseMpesaTransaction } = require("../services/mpesaService.js");

const router = express.Router();

router.post("/stkpush", lipaNaMpesa);
router.post("/callback", handleMpesaCallback);

router.post("/reverse", async (req, res) => {
  const { transactionId, amount } = req.body;

  try {
    const result = await reverseMpesaTransaction(transactionId, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/reversal-callback", (req, res) => {
  console.log("Received Reversal Callback:", req.body);
  res.status(200).json({ message: "Callback received" });
});

module.exports = router;
