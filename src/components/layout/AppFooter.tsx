import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ListOrdered, User } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility function

const AppFooter: React.FC = () => {
  console.log('AppFooter loaded');
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home', icon: Home, exact: true },
    { href: '/', label: 'Search', icon: Search, exact: false }, // Search functionality is on Home page
    { href: '/order-tracking_-history', label: 'Orders', icon: ListOrdered, exact: false },
    { href: '/profile', label: 'Profile', icon: User, exact: false }, // Placeholder route
  ];

  // Hide footer on specific pages if needed, e.g., checkout
  // if (location.pathname === '/checkout') {
  //   return null;
  // }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <nav className="container flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href) && (item.href !== '/' || location.pathname === '/');
          
          // Special handling for Search to be active only if Home is not also active and path is '/'
          let effectiveIsActive = isActive;
          if (item.label === 'Search' && item.href === '/') {
             effectiveIsActive = location.pathname === '/' && navItems.find(i => i.label === 'Home')?.href !== '/';
          }
           // If 'Home' and 'Search' both point to '/', only one should be 'active'
           // Prefer 'Home' if path is exactly '/'
           if (location.pathname === '/' && item.label === 'Search' && navItems.some(i => i.label === 'Home' && i.href === '/')) {
            effectiveIsActive = false;
           }
           if (location.pathname === '/' && item.label === 'Home' && item.href === '/') {
            effectiveIsActive = true;
           }


          return (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive: navLinkIsActive }) => // Use NavLink's isActive for general cases
                cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-md text-xs font-medium transition-colors",
                  (item.label === 'Search' ? effectiveIsActive : navLinkIsActive) // Apply custom logic for search or general NavLink logic
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
              end={item.exact} // For NavLink to match exact paths correctly
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </footer>
  );
};

export default AppFooter;