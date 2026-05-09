import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 120000 });

export const generatePresentation = (payload) =>
  api.post("/generate-ppt", payload);

export const summarizeText = (payload) =>
  api.post("/summarize", payload);

export const getDownloadUrl = (fileId) =>
  `/api/download/${fileId}`;
