const express = require("express");

const router = express.Router();
const axios = require("axios");
const qs = require("qs");

router.get("/characters", async (req, res) => {
  try {
    let params = {};
    if (req.query.name) {
      params = {
        apiKey: process.env.API_KEY,
        name: debouncedSearch,
      };
    } else if (req.query.limit || req.query.skip) {
      params = {
        apiKey: process.env.API_KEY,
        limit: limit,
        skip: skip,
      };
    }

    const queryParams = qs.stringify(params);

    await axios
      .get(`${process.env.URL_BACKEND_LEREACTEUR}/characters?${queryParams}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

module.exports = router;
