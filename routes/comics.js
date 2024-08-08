const express = require("express");

const router = express.Router();
const axios = require("axios");
const qs = require("qs");

router.get("/comics", async (req, res) => {
  try {
    let params = {};
    if (req.query.title) {
      params = {
        apiKey: process.env.API_KEY,
        title: req.query.title,
      };
    } else if (req.query.limit || req.query.skip) {
      params = {
        apiKey: process.env.API_KEY,
        limit: req.query.limit,
        skip: req.query.skip,
      };
    }

    const queryParams = qs.stringify(params);

    await axios
      .get(`${process.env.URL_BACKEND_LEREACTEUR}/comics?${queryParams}`)
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

router.get("/comics/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const apiKey = process.env.API_KEY;
    console.log(id, apiKey);

    await axios
      .get(`${process.env.URL_BACKEND_LEREACTEUR}/comics/${id}?apiKey=${apiKey}`)
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
