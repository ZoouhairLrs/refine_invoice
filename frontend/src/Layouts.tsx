import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, Search, Menu, User, Settings, Home, 
  BarChart, Users, Mail, Calendar, Files, 
  LayoutDashboard, LogOut, ChevronDown, 
  CreditCard, Sun, Moon, Laptop
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [theme, setTheme] = React.useState('light');

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BarChart, label: 'Produits', path: '/produits' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Calendar, label: 'Factures', path: '/factures' },
    { icon: Files, label: 'Devis', path: '/devis' },
    { icon: Mail, label: 'Bon de Commande', path: '/bonddecommand' },
  ];

  const toggleTheme = (mode) => {
    setTheme(mode);
  };

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background shadow-md">
        <div className="flex h-16 items-center px-4">
          {/* Left section with menu and logo */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5 text-green-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
                    <nav className="space-y-1">
                      {navigationItems.map((item) => (
                        <Link key={item.label} to={item.path}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-green-100 text-green-700"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-green-600"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo/Company Name */}
            <span className="font-semibold text-lg text-green-600">CRM ERP System</span>
          </div>

          {/* Center section with search */}
          <div className="flex-1 px-4 hidden md:block max-w-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
              />
            </div>
          </div>

          {/* Right section with actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-600">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-2 p-2">
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4 text-green-600" />Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-green-600" />Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Laptop className="mr-2 h-4 w-4 text-green-600" />Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => toggleTheme('light')}>
                      <Sun className="mr-2 h-4 w-4 text-green-600" />Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4 text-green-600" />Dark
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4 text-green-600" />Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } hidden lg:block border-r bg-background flex-shrink-0 transition-all duration-300 ease-in-out`}>
          <nav className="h-full py-4 px-3">
            {navigationItems.map((item) => (
              <Link key={item.label} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start mb-1 text-gray-700 hover:bg-green-100 ${
                    !isSidebarOpen && 'justify-center px-0'
                  }`}
                >
                  <item.icon className={`text-green-700 h-4 w-4 ${isSidebarOpen && 'mr-2'}`} />
                  {isSidebarOpen && item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="container mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
