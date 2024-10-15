// Produits.tsx
import React, { useState } from 'react';
import { Input } from '../components/ui/Input'; // Update with actual imports
import { Button } from '../components/ui/Button'; // Update with actual imports
import { Modal } from '../components/ui/Modal'; // Update with actual imports
import { ProductForm } from '../components/ProductForm'; // Create this component for the product form
import { Table } from '../components/ui/Table'; // Create this component for the product table
import { Product } from '../types/Product'; // Define the Product type

const Produits: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Replace with your data fetching logic
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: Product) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    } else {
      // Add new product
      setProducts([...products, { ...product, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Ajouter Produit
        </Button>
      </div>
      <Table data={filteredProducts} onEdit={(product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }} />
      <Modal title={selectedProduct ? 'Edit Product' : 'Add Product'} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm
          onSubmit={handleAddProduct}
          selectedProduct={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Produits;
