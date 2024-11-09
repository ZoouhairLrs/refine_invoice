import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Your backend URL

// Fetch all resources (e.g., produits, clients, etc.)
export const getData = async (resource) => {
  try {
    const response = await axios.get(`${API_URL}/${resource}/`); // Add trailing slash here
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des ${resource}.`);
  }
};

// Add a new resource (e.g., produit, client, etc.)
export const addData = async (resource, formData) => {
  try {
    console.log(`${API_URL}/${resource}/`);
    const response = await axios.post(`${API_URL}/${resource}/`, formData, {  // Add trailing slash here
      headers: {
        'Content-Type': 'multipart/form-data',  // Required for file uploads
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de l’ajout du ${resource.slice(0, -1)}.`);
  }
};

// Update an existing resource (e.g., produit, client, etc.)
export const updateData = async (resource, id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${resource}/${id}/`, formData, {  // Add trailing slash here
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du ${resource.slice(0, -1)}.`);
  }
};

// Delete a resource (e.g., produit, client, etc.)
export const deleteData = async (resource, id) => {
  console.log(`${API_URL}/${resource}/${id}/`);
  try {
    const response = await axios.delete(`${API_URL}/${resource}/${id}/`);  // Add trailing slash here
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la suppression du ${resource.slice(0, -1)}.`);
  }
};
