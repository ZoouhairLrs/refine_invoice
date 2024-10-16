// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/produits/'; // Replace with your actual API URL

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
  console.log(response.data);
};

// export const addProduct = async (productData) => {
//   try {
//       const response = await axios.post('http://localhost:8000/api/produits/', productData); // ensure the endpoint is correct
//       return response.data;
//   } catch (error) {
//       throw error; // This will allow you to catch the error in your handleAddProduct function
//   }
// };

export const addProduct = async (productData) => {
  try {
      const response = await axios.post('http://localhost:8000/api/produits/', productData, {
          headers: {
              "Content-Type": "application/json",
          },
      });
      // Log the response to see what you're getting
      console.log("Response data:", response.data);
      return response.data;
  } catch (error) {
      // Log error details
      console.error("Error adding product:", error.response?.data || error.message);
      throw error;  // Re-throw the error if you need to handle it elsewhere
  }
};

export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}${id}/`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}${id}/`);
};
