import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your backend URL

// Fetch all products
export const getProduits = async () => {
  try {
    const response = await axios.get(`${API_URL}/produits`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des produits.');
  }
};

// Add a new product
export const addProduit = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/produits`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de l’ajout du produit.');
  }
};

// Update a product
export const updateProduit = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/produits/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du produit.');
  }
};

// Delete a product
export const deleteProduit = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/produits/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la suppression du produit.');
  }
};
