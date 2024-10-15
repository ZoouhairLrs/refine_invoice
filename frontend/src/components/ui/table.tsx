// Table.tsx
import React from 'react';
import { Product } from '../types/Product'; // Define the Product type

interface TableProps {
  data: Product[];
  onEdit: (product: Product) => void;
}

export const Table: React.FC<TableProps> = ({ data, onEdit }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 text-left">ID</th>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Price</th>
          <th className="py-2 px-4 text-left">Category</th>
          <th className="py-2 px-4 text-left">Image</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product) => (
          <tr key={product.id} className="border-b hover:bg-gray-100 transition">
            <td className="py-2 px-4">{product.id}</td>
            <td className="py-2 px-4">{product.name}</td>
            <td className="py-2 px-4">${product.price.toFixed(2)}</td>
            <td className="py-2 px-4">{product.category}</td>
            <td className="py-2 px-4">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-16 rounded" />}
            </td>
            <td className="py-2 px-4">
              <button onClick={() => onEdit(product)} className="text-indigo-600 hover:underline">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
