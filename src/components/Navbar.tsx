import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User, LogOut, Package } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CartDrawer } from "./CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { products } from "@/data/products";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/combos", label: "Combos" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const searchResults = searchQuery.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = (productId: string) => {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Logo className="h-12 md:h-14" />

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-sm"
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSearch(p.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left"
                      >
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">MK {p.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500 text-center">No products found</p>
                )}
              </div>
            )}
          </div>

          <CartDrawer>
            <button className="relative p-2.5 rounded-full hover:bg-gray-100" aria-label="Open cart">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </CartDrawer>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-full hover:bg-gray-100" aria-label="Account">
                  <User className="h-5 w-5 text-gray-700" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link to="/orders"><Package className="h-4 w-4 mr-2" />My orders</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 text-gray-700">Sign in</Link>
          )}

          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive ? "text-gray-900 bg-gray-100" : "text-gray-500"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-base font-medium text-gray-500">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};