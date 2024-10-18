import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Plus, Search, Edit, Trash, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { getProduits, addProduit, updateProduit, deleteProduit } from '../api/api'; // Import API functions

const ProduitsPage = () => {
  const [produits, setProduits] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // For image upload
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const { toast } = useToast();

  // Fetch all products from the back-end
  const fetchProduits = async () => {
    try {
      const data = await getProduits();
      setProduits(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des produits.",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleAddProduit = () => {
    setSelectedProduit(null);
    setSelectedImage(null); // Reset image on add
    setIsDialogOpen(true);
  };

  const handleEditProduit = (produit) => {
    setSelectedProduit(produit);
    setSelectedImage(null); // Reset image on edit
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (produit) => {
    setProduitToDelete(produit);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduit(produitToDelete.id);
      setProduits(produits.filter(p => p.id !== produitToDelete.id));
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du produit.",
        status: "error",
      });
    }
    setIsDeleteDialogOpen(false);
    setProduitToDelete(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (selectedImage) {
      formData.append('image', selectedImage); // Add image to FormData
    }

    try {
      if (selectedProduit) {
        await updateProduit(selectedProduit.id, formData);
        setProduits(produits.map(p => 
          p.id === selectedProduit.id ? { ...p, ...Object.fromEntries(formData) } : p
        ));
        toast({
          title: "Produit mis à jour",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        const newProduit = await addProduit(formData);
        setProduits([...produits, newProduit]);
        toast({
          title: "Produit ajouté",
          description: "Le nouveau produit a été ajouté avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout ou mise à jour du produit.",
        status: "error",
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-green-800">Gestion des Produits</CardTitle>
              <CardDescription>Gérez vos produits et leurs informations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddProduit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Produit
              </Button>
              <Button
                variant="outline"
                onClick={fetchProduits}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell>
                      {produit.image && <img src={produit.image} alt={produit.name} className="w-16 h-16 object-cover rounded" />}
                    </TableCell>
                    <TableCell className="font-medium">{produit.name}</TableCell>
                    <TableCell>{produit.category}</TableCell>
                    <TableCell>{produit.price}</TableCell>
                    <TableCell>{produit.stock}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        produit.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {produit.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduit(produit)}
                          className="hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(produit)}
                          className="hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Produit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduit ? 'Modifier le Produit' : 'Ajouter un Produit'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduit 
                ? 'Modifier les informations du produit existant.' 
                : 'Remplissez les informations pour ajouter un nouveau produit.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom du produit"
                  defaultValue={selectedProduit?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Catégorie"
                  defaultValue={selectedProduit?.category}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Prix en MAD"
                  defaultValue={selectedProduit?.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Quantité en stock"
                  defaultValue={selectedProduit?.stock}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image du produit</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full pl-10"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {selectedProduit ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit {produitToDelete?.name} ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProduitsPage;
