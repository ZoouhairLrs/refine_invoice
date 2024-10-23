import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { Plus, Edit, Trash, RefreshCw } from 'lucide-react';
import { getData, addData, updateData, deleteData } from '../api/api';

const FacturesPage = () => {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]); // Client data for dropdown
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch factures and clients from the back-end
  const fetchFactures = async () => {
    try {
      const data = await getData('factures');
      setFactures(data);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des factures.', status: 'error' });
    }
  };

  const fetchClients = async () => {
    try {
      const data = await getData('clients');
      setClients(data);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des clients.', status: 'error' });
    }
  };

  useEffect(() => {
    fetchFactures();
    fetchClients();
  }, []);

  const handleAddFacture = () => {
    setSelectedFacture(null);
    setIsDialogOpen(true);
  };

  const handleEditFacture = (facture) => {
    setSelectedFacture(facture);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (facture) => {
    setFactureToDelete(facture);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteData('factures', factureToDelete.id);
      setFactures(factures.filter(f => f.id !== factureToDelete.id));
      toast({ title: 'Facture supprimée', description: 'La facture a été supprimée avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression de la facture.', status: 'error' });
    }
    setIsDeleteDialogOpen(false);
    setFactureToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const factureData = Object.fromEntries(formData);

    try {
      if (selectedFacture) {
        // Update facture
        await updateData('factures', selectedFacture.id, factureData);
        setFactures(factures.map(f => (f.id === selectedFacture.id ? { ...f, ...factureData } : f)));
        toast({ title: 'Facture mise à jour', description: 'La facture a été mise à jour avec succès.' });
      } else {
        // Add new facture
        const newFacture = await addData('factures', factureData);
        setFactures([newFacture, ...factures]);
        toast({ title: 'Facture ajoutée', description: 'La nouvelle facture a été ajoutée avec succès.' });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout ou mise à jour de la facture.', status: 'error' });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="bg-white shadow-lg rounded-lg">
        {/* Align title and buttons on the same line */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Gestion des Factures
          </CardTitle>
          <div className="flex gap-4">
            <Button 
              onClick={handleAddFacture} 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Facture
            </Button>
            <Button
              variant="outline"
              onClick={fetchFactures}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="rounded-md border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factures.length > 0 ? factures.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell className="font-medium">{facture.number}</TableCell>
                    <TableCell>{facture.client?.name}</TableCell>
                    <TableCell>{facture.date}</TableCell>
                    <TableCell>{facture.amount} MAD</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        facture.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {facture.status === 'paid' ? 'Payée' : 'Non Payée'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFacture(facture)}
                          className="hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(facture)}
                          className="hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                      Aucune facture disponible pour le moment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Facture Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedFacture ? 'Modifier la Facture' : 'Ajouter une Facture'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="number">Numéro de la facture</Label>
              <Input
                id="number"
                name="number"
                placeholder="Numéro de la facture"
                defaultValue={selectedFacture?.number || ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select name="client" defaultValue={selectedFacture?.client?.id || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date de Facture</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={selectedFacture?.date || ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Montant en MAD"
                defaultValue={selectedFacture?.amount || ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select name="status" defaultValue={selectedFacture?.status || 'unpaid'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="unpaid">Non Payée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {selectedFacture ? 'Mettre à jour' : 'Ajouter'}
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Supprimer</Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacturesPage;
