import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Menu, Search, Home, Briefcase, Users, Calendar, BarChart, Settings, LogOut, User, Factory, CommandIcon, FactoryIcon } from 'lucide-react';

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ icon: Icon, label, path }) => {
    const navigate = useNavigate();
    
    return (
      <Button
        variant="ghost"
        className="flex items-center w-full justify-start hover:bg-green-600 transition duration-200 rounded-md p-2"
        onClick={() => navigate(path)} // Navigate to the specified path
      >
        <Icon className="mr-3 h-5 w-5 text-white" />
        {label}
      </Button>
    );
  };

  const Sidebar = () => (
    <div className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0 z-10">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h2 className="text-xl font-semibold">CRM Dashboard</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="flex flex-col py-6 space-y-2 px-2">
          <NavItem icon={Home} label="Dashboard" path="/dashboard" />
          <NavItem icon={Briefcase} label="Produits" path="/Produits" />
          <NavItem icon={Users} label="Clients" path="/clients" />
          <NavItem icon={Factory} label="Factures" path="/Factures" />
          <NavItem icon={CommandIcon} label="BondDeCommands" path="/bonddecommand" />
          <NavItem icon={FactoryIcon} label="Devis" path="/Devis" />
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-green-800 text-white">
                  <nav className="flex flex-col space-y-2 mt-4">
                    <NavItem icon={Home} label="Dashboard" path="/dashboard" />
                    <NavItem icon={Briefcase} label="Produits" path="/Produits" />
                    <NavItem icon={Users} label="Clients" path="/clients" />
                    <NavItem icon={Factory} label="Factures" path="/Factures" />
                    <NavItem icon={CommandIcon} label="BondDeCommands" path="/bonddecommand" />
                    <NavItem icon={FactoryIcon} label="Devis" path="/Devis" />
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-green-900 ml-2">My CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white transition-colors duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 ml-0 lg:ml-64 p-6 bg-gray-100 h-full overflow-y-auto flex flex-col">
          <div className="bg-white shadow-lg rounded-lg p-6 flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
