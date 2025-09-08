import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // tu backend en Express
});

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
