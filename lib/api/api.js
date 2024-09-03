import axios from "axios";
import { NEWS_API_KEY } from "@env";

const api = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export async function getNewsByCategory(category) {
  const response = await api.get(
    `/everything?q=${category}&apiKey=${NEWS_API_KEY}`
  );
  return response.data;
}

export async function getTopNewsByCountry(country) {
  const response = await api.get(
    `/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`
  );
  return response.data;
}

export async function getNewsByQuery(query) {
  const response = await api.get(
    `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
  );
  return response.data;
}
