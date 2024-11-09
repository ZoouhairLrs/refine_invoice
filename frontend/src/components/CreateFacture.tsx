import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { getData, addData } from '../api/api';
import { Plus, XCircle } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  ice: string;
  ville: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
  price: number;
}

const CreateFacturePage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Product[]>([]);
  const [selectedProduits, setSelectedProduits] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getData('clients');
      setClients(data);
    };
    const fetchProduits = async () => {
      const data = await getData('produits');
      setProduits(data);
    };
    fetchClients();
    fetchProduits();
  }, []);

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId) || null;
    setSelectedClient(client);
  };

  const handleAddProduct = () => {
    setSelectedProduits([...selectedProduits, { productId: '', quantity: 1, price: 0 }]);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = produits.find(prod => prod.id === productId);
    if (!product) return;

    const updatedProduits = [...selectedProduits];
    updatedProduits[index] = {
      productId: product.id,
      quantity: 1,
      price: product.price,
    };
    setSelectedProduits(updatedProduits);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedProduits = [...selectedProduits];
    updatedProduits[index].quantity = quantity;
    setSelectedProduits(updatedProduits);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProduits(selectedProduits.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedProduits.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const tax = subtotal * 0.2;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmit = async () => {
      const factureData = {
        client: selectedClient,
        date: invoiceDate,
        produits: selectedProduits,
    };

    try {
      await addData('factures', factureData);
      toast({ title: 'Facture ajoutée', description: 'La nouvelle facture a été ajoutée avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: "Erreur lors de l'ajout de la facture.", status: 'error' });
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Informations Client</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Client</Label>
            <Select onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date de Facture</Label>
            <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
          </div>

          {selectedClient && (
            <>
              <div>
                <Label>ICE</Label>
                <Input value={selectedClient.ice || ""} readOnly />
              </div>
              <div>
                <Label>Ville</Label>
                <Input value={selectedClient.ville || ""} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={selectedClient.email || ""} readOnly />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input value={selectedClient.phone || ""} readOnly />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-800">Produits</CardTitle>
          <Button onClick={handleAddProduct} className="bg-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Ajouter Produit
          </Button>
        </CardHeader>
        <CardContent>
          {selectedProduits.map((product, index) => {
            const selectedProductDetails = produits.find(prod => prod.id === product.productId);
            return (
              <div key={index} className="grid grid-cols-12 gap-4 items-center py-4 border-b">
                
                {/* Product Selection Dropdown */}
                <div className="col-span-3">
                  <Select onValueChange={(value) => handleProductChange(index, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {produits.map(prod => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name} - {prod.price} MAD
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Product Image and Description */}
                {selectedProductDetails ? (
                  <div className="col-span-4 flex items-center gap-4">
                    <img
                      src={selectedProductDetails.imageUrl || 'path/to/default-image.jpg'}
                      alt={selectedProductDetails.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={(e) => { e.currentTarget.src = 'path/to/default-image.jpg'; }}
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-gray-700">{selectedProductDetails.name}</span>
                      <span className="text-sm text-gray-500">{selectedProductDetails.description}</span>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-4 flex items-center justify-center text-gray-400">
                    <span>Aucune information produit</span>
                  </div>
                )}

                {/* Quantity Input */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                    placeholder="Quantité"
                    className="text-center border-gray-300 rounded-md"
                  />
                </div>

                {/* Price Display */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={selectedProductDetails?.price || 0}
                    readOnly
                    placeholder="Prix"
                    className="text-center bg-gray-100 border-gray-300 rounded-md"
                  />
                </div>

                {/* Remove Product Button */}
                <Button onClick={() => handleRemoveProduct(index)} variant="ghost" size="icon" className="col-span-1">
                  <XCircle className="text-red-600 h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Résumé de la Facture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{calculateTotal().subtotal.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between">
            <span>Taxe (20%)</span>
            <span>{calculateTotal().tax.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{calculateTotal().total.toFixed(2)} MAD</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-green-600 text-white">Sauvegarder la Facture</Button>
      </div>
    </div>
  );
};

export default CreateFacturePage;
