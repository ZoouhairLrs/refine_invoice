import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import { Plus, Edit, Trash, RefreshCw, Search } from 'lucide-react';
import { getData, deleteData } from '../api/api';

const FacturesPage = () => {
  const [factures, setFactures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchFactures = async () => {
    try {
      const data = await getData('factures');
      setFactures(data);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des factures.', status: 'error' });
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const handleAddFacture = () => {
    navigate('/ajouter-facture');
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Gestion des Factures</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleAddFacture} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Facture
              </Button>
              <Button onClick={fetchFactures} variant="outline">
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
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                        facture.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {facture.status === 'paid' ? 'Payée' : 'Non Payée'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-red-600">
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
    </div>
  );
};

export default FacturesPage;
