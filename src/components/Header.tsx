
import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="bg-[#9b87f5] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Travel XMRT</h1>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#9b87f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7E69AB] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                )}
                href="/"
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-[#9b87f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7E69AB] focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                )}
                href="/about"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
