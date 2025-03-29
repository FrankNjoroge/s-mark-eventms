const express = require("express");
const { lipaNaMpesa } = require("../controllers/mpesaController.js");

const router = express.Router();

router.post("/stkpush", lipaNaMpesa);

module.exports = router;
