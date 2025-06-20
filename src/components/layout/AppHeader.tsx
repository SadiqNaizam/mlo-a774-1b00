import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UtensilsCrossed, MapPin, Search, ShoppingCart, ChevronLeft, Menu } from 'lucide-react';

interface AppHeaderProps {
  customTitle?: string;
  // Future props like cartItemCount could be added here
}

const AppHeader: React.FC<AppHeaderProps> = ({ customTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('AppHeader loaded, current path:', location.pathname);

  const isHomePage = location.pathname === '/';
  const isCartPage = location.pathname === '/cart';
  const isCheckoutPage = location.pathname === '/checkout';
  const isRestaurantMenuPage = location.pathname === '/restaurant-menu'; // Example detail page
  const isOrderTrackingPage = location.pathname === '/order-tracking_-history';

  let pageTitle = "DeliverEats";
  if (customTitle) {
    pageTitle = customTitle;
  } else if (isCartPage) {
    pageTitle = "My Cart";
  } else if (isCheckoutPage) {
    pageTitle = "Checkout";
  } else if (isRestaurantMenuPage) {
    // For a real app, this title would likely be dynamic, e.g., the restaurant's name
    // Passed via customTitle prop from the page component
    pageTitle = "Restaurant Menu"; // Placeholder if customTitle not provided
  } else if (isOrderTrackingPage) {
    pageTitle = "Order Status";
  }


  const showBackButton = !isHomePage;
  const showSearchInput = isHomePage; // Only show search input on homepage

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {showBackButton ? (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center gap-2 md:hidden">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </Link>
          )}
           <Link to="/" className={`items-center gap-2 hidden md:flex ${showBackButton ? 'ml-2' : ''}`}>
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg whitespace-nowrap">DeliverEats</span>
          </Link>
        </div>

        {isHomePage ? (
           <div className="flex-1 max-w-xs md:max-w-md lg:max-w-lg hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              <MapPin className="h-4 w-4 mr-2" />
              Set Location
            </Button>
          </div>
        ) : (
          <h1 className="font-semibold text-lg text-center flex-1 truncate md:flex-none">
            {pageTitle}
          </h1>
        )}


        {showSearchInput && (
          <div className="relative flex-1 ml-auto md:flex-grow-0 hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants or dishes..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Cart">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link
                    to="/"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <UtensilsCrossed className="h-5 w-5" />
                    DeliverEats
                  </Link>
                  {isHomePage && (
                     <div className="relative mx-2.5">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8"
                        />
                    </div>
                  )}
                  <Button variant="ghost" className="w-full justify-start gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <MapPin className="h-5 w-5" />
                    Set Location
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;