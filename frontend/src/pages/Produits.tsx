import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea"; 
import { useToast } from "../hooks/use-toast";
import { Plus, Search, Edit, Trash, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { getData, addData, updateData, deleteData } from '../api/api';

const ProduitsPage = () => {
  const [produits, setProduits] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const produitsPerPage = 6;

  // Fetch all products from the back-end
  const fetchProduits = async () => {
    try {
      const data = await getData('produits');
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

  // Filter products based on the search term (by product name)
  const filteredProduits = produits.filter(produit =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduit = currentPage * produitsPerPage;
  const indexOfFirstProduit = indexOfLastProduit - produitsPerPage;
  const currentProduits = filteredProduits.slice(indexOfFirstProduit, indexOfLastProduit);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProduits.length / produitsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddProduit = () => {
    setSelectedProduit(null);
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleEditProduit = (produit: any) => {
    setSelectedProduit(produit);
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (produit: any) => {
    setProduitToDelete(produit);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteData('produits', produitToDelete.id);
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
    
    // Get data from the form
    const formData = new FormData(e.target);
    const produitData = Object.fromEntries(formData); // Convert FormData to an object
  
    try {
      if (selectedProduit) {
        // Update existing product
        const updatedProduit = await updateData('produits', selectedProduit.id, produitData);  // Update request
        setProduits([
          updatedProduit,  // Add the updated product to the top of the array
          ...produits.filter(p => p.id !== selectedProduit.id)  // Remove the old product from its previous position
        ]);
        toast({ title: "Produit mis à jour", description: "Le produit a été mis à jour avec succès." });
      } else {
        // Add new product
        const newProduit = await addData('produits', produitData);  // Add new product request
        setProduits([newProduit, ...produits]);  // Add the new product at the beginning of the table
        toast({ title: "Produit ajouté", description: "Le nouveau produit a été ajouté avec succès." });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout ou mise à jour du produit.",
        status: "error",
      });
    }
  
    setIsDialogOpen(false);  // Close the dialog after submission
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
                placeholder="Rechercher un produit par nom..."
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
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProduits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell>
                      {produit.image && <img src={produit.image} alt={produit.name} className="w-16 h-16 object-cover rounded" />}
                    </TableCell>
                    <TableCell className="font-medium">{produit.name}</TableCell>
                    <TableCell>{produit.description}</TableCell>
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

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              Précédent
            </Button>
            <span>{`Page ${currentPage} sur ${Math.ceil(filteredProduits.length / produitsPerPage)}`}</span>
            <Button
              variant="outline"
              disabled={currentPage === Math.ceil(filteredProduits.length / produitsPerPage)}
              onClick={handleNextPage}
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Produit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedProduit ? 'Modifier le Produit' : 'Ajouter un Produit'}</DialogTitle>
          <DialogDescription>
            {selectedProduit
              ? 'Modifier les informations du produit existant.'
              : 'Remplissez les informations pour ajouter un nouveau produit.'}
          </DialogDescription>
        </DialogHeader>
        
        {/* Form to add or update a product */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nom du produit"
              defaultValue={selectedProduit?.name || ''} 
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description du produit"
              defaultValue={selectedProduit?.description || ''} 
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              name="category"
              placeholder="Catégorie"
              defaultValue={selectedProduit?.category || ''} 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Prix en MAD"
                defaultValue={selectedProduit?.price || ''} 
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
                defaultValue={selectedProduit?.stock || ''} 
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
            {selectedProduit?.image && (
              <div className="mt-2">
                <img
                  src={selectedProduit.image}  
                  alt="Current product"
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            )}
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
