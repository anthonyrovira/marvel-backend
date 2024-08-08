import axios, { AxiosResponse } from "axios";
import { Router, Request, Response } from "express";

const qs = require("qs");

const charactersRoutes = Router();

interface CharactersQueryParams {
  name?: string;
  limit?: string;
  skip?: string;
}

charactersRoutes.get("/characters", async (req: Request, res: Response) => {
  try {
    const queryParams: CharactersQueryParams = {};

    if (req.query.name) {
      queryParams.name = req.query.name as string;
    }

    if (req.query.limit) {
      queryParams.limit = req.query.limit as string;
    }

    if (req.query.skip) {
      queryParams.skip = req.query.skip as string;
    }

    const queryString = qs.stringify({
      apiKey: process.env.API_KEY,
      ...queryParams,
    });

    try {
      const response: AxiosResponse = await axios.get(`${process.env.URL_BACKEND_LEREACTEUR}/characters?${queryString}`);
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching characters" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    } else {
      console.log("Unknown error occurred");
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

export default charactersRoutes;
