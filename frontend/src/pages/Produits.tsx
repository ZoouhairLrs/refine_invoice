import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../api/api'; // Adjust the path as necessary

const Produits = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({ title: 'Erreur', description: 'Erreur lors de la récupération des produits.', status: 'error' });
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete.id);
      setProducts(products.filter((product) => product.id !== productToDelete.id));
      toast({
        title: 'Produit supprimé',
        description: `${productToDelete.name} a été supprimé avec succès.`,
        status: 'success',
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression du produit.', status: 'error' });
    } finally {
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    
    if (selectedProduct) {
      // Update product
      try {
        await updateProduct(selectedProduct.id, formData);
        setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, ...Object.fromEntries(formData) } : p)));
        toast({ title: 'Produit mis à jour', description: 'Le produit a été mis à jour avec succès.', status: 'success' });
      } catch (error) {
        console.error("Error updating product:", error);
        toast({ title: 'Erreur', description: 'Erreur lors de la mise à jour du produit.', status: 'error' });
      }
    } else {
      // Add product
      try {
        const newProduct = await addProduct(formData);
        setProducts([...products, newProduct]);
        toast({ title: 'Produit ajouté', description: 'Le produit a été ajouté avec succès.', status: 'success' });
      } catch (error) {
        console.error("Error adding product:", error);
        toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout du produit.', status: 'error' });
      }
    }
  
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Produits</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white">
          <Plus className="w-4 h-4" />
          Ajouter Produit
        </Button>
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50 transition duration-200">
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">
                    {product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />}
                  </TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{product.id}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{product.name}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{product.category}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{product.price} MAD</TableCell>
                  <TableCell className="p-3 border-b border-gray-200 text-gray-700">{product.stock}</TableCell>
                  <TableCell className="p-3 border-b border-gray-200">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4 text-gray-500 hover:text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleConfirmDelete(product)}>
                        <Trash className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="p-3 text-center text-gray-500">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for adding or editing product */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Modifier Produit' : 'Ajouter Produit'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="productName" placeholder="Nom du produit" defaultValue={selectedProduct ? selectedProduct.name : ''} required />
            <Textarea name="productDescription" placeholder="Description du produit" defaultValue={selectedProduct ? selectedProduct.description : ''} />
            <Input name="productCategory" placeholder="Catégorie" defaultValue={selectedProduct ? selectedProduct.category : ''} required />
            <Input type="number" name="productPrice" placeholder="Prix" defaultValue={selectedProduct ? selectedProduct.price : ''} required />
            <Input type="number" name="productStock" placeholder="Stock" defaultValue={selectedProduct ? selectedProduct.stock : ''} required />
            <Input type="file" name="productImage" accept="image/*" />
            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-500 text-white">Sauvegarder</Button>
              <Button type="button" onClick={() => setIsDialogOpen(false)} className="bg-gray-300 hover:bg-gray-200">Annuler</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer le produit {productToDelete?.name}?</p>
          <DialogFooter>
            <Button onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-500 text-white">Supprimer</Button>
            <Button type="button" onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-300 hover:bg-gray-200">Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Produits;
