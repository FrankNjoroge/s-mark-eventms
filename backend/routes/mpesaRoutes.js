const express = require("express");
const {
  lipaNaMpesa,
  handleMpesaCallback,
} = require("../controllers/mpesaController.js");

const router = express.Router();

router.post("/stkpush", lipaNaMpesa);
router.post("/callback", handleMpesaCallback);

module.exports = router;
