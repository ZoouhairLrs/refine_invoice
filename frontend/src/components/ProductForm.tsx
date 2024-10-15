// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button'; // Custom button component
import { Input } from './ui/input'; // Custom input component
import { Upload } from './ui/upload'; // Custom input component
import { Product } from '../types/Product'; // Define the Product type

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  selectedProduct: Product | null;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, selectedProduct, onClose }) => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setPrice(selectedProduct.price);
      setCategory(selectedProduct.category);
      setImageUrl(selectedProduct.imageUrl);
    } else {
      setName('');
      setPrice(0);
      setCategory('');
      setImageUrl('');
    }
  }, [selectedProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: selectedProduct?.id || Date.now(), name, price, category, imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
        required
      />
      <Input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <Upload
        onChange={(url) => setImageUrl(url)}
        placeholder="Upload Image"
        value={imageUrl}
      />
      <div className="flex justify-between">
        <Button type="button" onClick={onClose} className="bg-gray-400 text-white">Cancel</Button>
        <Button type="submit" className="bg-indigo-600 text-white">Submit</Button>
      </div>
    </form>
  );
};
