// import axios, { AxiosResponse } from "axios";
// import { Router, Request, Response } from "express";

// const qs = require("qs");

// const comicsRoutes = Router();

// interface ComicsQueryParams {
//   title?: string;
//   limit?: string;
//   skip?: string;
// }

// comicsRoutes.get("/comics", async (req: Request, res: Response) => {
//   try {
//     const queryParams: ComicsQueryParams = {};

//     if (req.query.title) {
//       queryParams.title = req.query.title as string;
//     }

//     if (req.query.limit) {
//       queryParams.limit = req.query.limit as string;
//     }

//     if (req.query.skip) {
//       queryParams.skip = req.query.skip as string;
//     }

//     const queryString = qs.stringify({
//       apiKey: process.env.API_KEY,
//       ...queryParams,
//     });

//     try {
//       const response: AxiosResponse = await axios.get(`${process.env.URL_BACKEND_LEREACTEUR}/comics?${queryString}`);
//       res.status(200).json(response.data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching comics" });
//     }
//     return;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.message);
//       res.status(400).json({ message: error.message });
//     } else {
//       console.error("Unknown error occurred");
//       res.status(400).json({ message: "An unknown error occurred" });
//     }
//     return;
//   }
// });

// comicsRoutes.get("/comics/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const apiKey = process.env.API_KEY;

//     try {
//       const response: AxiosResponse = await axios.get(`${process.env.URL_BACKEND_LEREACTEUR}/comics/${id}?apiKey=${apiKey}`);
//       res.status(200).json(response.data);
//       return;
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching comic by ID" });
//       return;
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.message);
//       res.status(400).json({ message: error.message });
//     } else {
//       console.error("Unknown error occurred");
//       res.status(400).json({ message: "An unknown error occurred" });
//     }
//     return;
//   }
// });

// export default comicsRoutes;
