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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { Plus, Search, Edit, Trash, Mail, Phone, MapPin, Building2, RefreshCw } from 'lucide-react';

// Import your API functions
import { getData, addData, updateData, deleteData } from '../api/api';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const { toast } = useToast();

  // Fetch all clients from the back-end
  const fetchClients = async () => {
    try {
      const data = await getData('clients');
      setClients(data);
      toast({ title: 'Clients chargés', description: 'Les clients ont été chargés avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des clients.', status: 'error' });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = () => {
    setSelectedClient(null); // Reset the form for new client
    setIsDialogOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client); // Preload form with selected client data
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteData('clients', clientToDelete.id); // Correct path for delete
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast({ title: 'Client supprimé', description: 'Le client a été supprimé avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la suppression du client.', status: 'error' });
    }
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = Object.fromEntries(formData);

    try {
      if (selectedClient) {
        // Update client
        await updateData('clients', selectedClient.id, clientData); // Correct the update call
        setClients(clients.map(c => (c.id === selectedClient.id ? { ...c, ...clientData } : c)));
        toast({ title: 'Client mis à jour', description: 'Le client a été mis à jour avec succès.' });
      } else {
        // Add new client
        const newClient = await addData('clients', clientData);
        setClients([...clients, newClient]);
        toast({ title: 'Client ajouté', description: 'Le nouveau client a été ajouté avec succès.' });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'ajout ou mise à jour du client.', status: 'error' });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-green-800">Gestion des Clients</CardTitle>
              <CardDescription>Gérez vos clients et leurs informations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddClient}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Client
              </Button>
              <Button variant="outline" onClick={fetchClients}>
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
                placeholder="Rechercher un client..."
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
                  <TableHead>Société</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.type === 'enterprise' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {client.type === 'enterprise' ? 'Entreprise' : 'Particulier'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClient(client)}
                          className="hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(client)}
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? 'Modifier le Client' : 'Ajouter un Client'}
            </DialogTitle>
            <DialogDescription>
              {selectedClient 
                ? 'Modifier les informations du client existant.' 
                : 'Remplissez les informations pour ajouter un nouveau client.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la société</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nom de la société"
                    defaultValue={selectedClient?.name || ''}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Nom du contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Nom complet"
                  defaultValue={selectedClient?.contact || ''}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@exemple.com"
                    defaultValue={selectedClient?.email || ''}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+212 6-XX-XX-XX-XX"
                    defaultValue={selectedClient?.phone || ''}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Adresse complète"
                  defaultValue={selectedClient?.address || ''}
                  className="pl-10 min-h-[80px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de client</Label>
              <Select name="type" defaultValue={selectedClient?.type || "enterprise"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Entreprise</SelectItem>
                  <SelectItem value="individual">Particulier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {selectedClient ? 'Mettre à jour' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer le client {clientToDelete?.name} ? 
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

export default ClientsPage;
