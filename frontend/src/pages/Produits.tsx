import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Plus, Edit, Trash, Search, RefreshCw } from 'lucide-react'; // Added Refresh Icon
import { useToast } from '../hooks/use-toast';
import {
  getProduits,
  addProduit,
  updateProduit,
  deleteProduit,
} from '../api/api'; // Adjust the path as necessary
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'; // Importing ShadCN UI Select components

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Fetch products
  const fetchProduits = async () => {
    try {
      const data = await getProduits();
      setProduits(data);
    } catch (error) {
      console.error("Error fetching produits:", error);
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des produits.', status: 'error' });
    }
  };

  // Fetch products initially
  useEffect(() => {
    fetchProduits();
  }, []);

  // Filter products based on search term
  const filteredProduits = produits.filter((produit) =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new produit
  const handleAddProduit = () => {
    setSelectedProduit(null);
    setSelectedImage(null); // Reset image state
    setIsDialogOpen(true);
  };

  // Edit produit
  const handleEditProduit = (produit) => {
    setSelectedProduit(produit); // Set the produit to be edited
    setSelectedImage(null); // Reset the image state for editing
    setIsDialogOpen(true); // Open the dialog for editing
  };

  // Confirm delete produit
  const handleConfirmDelete = (produit) => {
    setProduitToDelete(produit);
    setIsDeleteConfirmOpen(true);
  };

  // Delete produit
  const handleDeleteProduit = async () => {
    try {
      await deleteProduit(produitToDelete.id);
      setProduits(produits.filter((produit) => produit.id !== produitToDelete.id));
      toast({
        title: 'Produit supprimé',
        description: `${produitToDelete.name} a été supprimé avec succès.`,
        status: 'success',
      });
    } catch (error) {
      console.error("Error deleting produit:", error);
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression du produit.', status: 'error' });
    } finally {
      setIsDeleteConfirmOpen(false);
      setProduitToDelete(null);
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Submit produit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      if (selectedProduit) {
        // Update produit
        await updateProduit(selectedProduit.id, formData);
        setProduits(produits.map((p) => (p.id === selectedProduit.id ? { ...p, ...Object.fromEntries(formData) } : p)));
        toast({ title: 'Produit mis à jour', description: 'Le produit a été mis à jour avec succès.', status: 'success' });
      } else {
        // Add new produit
        const newProduit = await addProduit(formData);
        setProduits([...produits, newProduit]);
        toast({ title: 'Produit ajouté', description: 'Le produit a été ajouté avec succès.', status: 'success' });
      }
    } catch (error) {
      console.error("Error submitting produit:", error);
      toast({ title: 'Erreur', description: `Erreur lors de l'ajout/mise à jour du produit.`, status: 'error' });
    }

    setIsDialogOpen(false);
  };

  // Handle refresh click
  const handleRefresh = () => {
    fetchProduits(); // Reload product data
    toast({ title: 'Produits actualisés', description: 'Les produits ont été actualisés avec succès.', status: 'info' });
  };

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Produits</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddProduit} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white">
            <Plus className="w-4 h-4" />
            Ajouter Produit
          </Button>
          <Button onClick={handleRefresh} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Rechercher produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
          icon={<Search className="text-muted-foreground" />}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <Table className="min-w-full bg-white rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <TableHead className="p-4 text-left">Image</TableHead>
              <TableHead className="p-4 text-left">ID</TableHead>
              <TableHead className="p-4 text-left">Nom</TableHead>
              <TableHead className="p-4 text-left">Catégorie</TableHead>
              <TableHead className="p-4 text-left">Prix</TableHead>
              <TableHead className="p-4 text-left">Stock</TableHead>
              <TableHead className="p-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProduits.length > 0 ? (
              filteredProduits.map((produit) => (
                <TableRow key={produit.id} className="hover:bg-gray-50 transition duration-200">
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">
                    {produit.image && <img src={produit.image} alt={produit.name} className="w-16 h-16 object-cover rounded" />}
                  </TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{produit.id}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{produit.name}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{produit.category}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{produit.price} MAD</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{produit.stock}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduit(produit)}>
                        <Edit className="w-4 h-4 text-gray-500 hover:text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleConfirmDelete(produit)}>
                        <Trash className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 p-4">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for adding/editing produit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduit ? 'Modifier Produit' : 'Ajouter Produit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 space-y-4">
              <Input
                name="name"
                placeholder="Nom du produit"
                defaultValue={selectedProduit?.name}
                required
                className="mb-2"
              />
              <Select
                name="category"
                required
                defaultValue={selectedProduit?.category}
                className="mb-2"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROTECTIONS DES PIEDS">PROTECTIONS DES PIEDS</SelectItem>
                  <SelectItem value="PROTECTION DE LA TÊTE">PROTECTION DE LA TÊTE</SelectItem>
                  <SelectItem value="PROTECTION DES MAINS">PROTECTION DES MAINS</SelectItem>
                  <SelectItem value="PROTECTIONS DU CORPS">PROTECTIONS DU CORPS</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                name="price"
                placeholder="Prix"
                defaultValue={selectedProduit?.price}
                required
                className="mb-2"
              />
              <Input
                type="number"
                name="stock"
                placeholder="Stock"
                defaultValue={selectedProduit?.stock}
                required
                className="mb-2"
              />
              <Textarea
                name="description"
                placeholder="Description du produit"
                defaultValue={selectedProduit?.description}
                className="mb-2"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                {selectedProduit ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button type="button" onClick={() => setIsDialogOpen(false)} className="bg-white hover:bg-gray-100 text-black">
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm delete dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <div>
            Êtes-vous sûr de vouloir supprimer le produit <strong>{produitToDelete?.name}</strong> ?
          </div>
          <DialogFooter>
            <Button onClick={handleDeleteProduit} className="bg-red-600 hover:bg-red-500 text-white">
              Supprimer
            </Button>
            <Button type="button" onClick={() => setIsDeleteConfirmOpen(false)} className="text-gray-500">
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Produits;
