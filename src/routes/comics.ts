import axios, { AxiosResponse } from "axios";
import { Router, Request, Response } from "express";

const qs = require("qs");

const comicsRoutes = Router();

interface ComicsQueryParams {
  title?: string;
  limit?: string;
  skip?: string;
}

comicsRoutes.get("/comics", async (req: Request, res: Response) => {
  try {
    const queryParams: ComicsQueryParams = {};

    if (req.query.title) {
      queryParams.title = req.query.title as string;
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
      const response: AxiosResponse = await axios.get(`${process.env.URL_BACKEND_LEREACTEUR}/comics?${queryString}`);
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching comics" });
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

comicsRoutes.get("/comics/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.API_KEY;

    try {
      const response: AxiosResponse = await axios.get(`${process.env.URL_BACKEND_LEREACTEUR}/comics/${id}?apiKey=${apiKey}`);
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching comic by ID" });
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

export default comicsRoutes;
