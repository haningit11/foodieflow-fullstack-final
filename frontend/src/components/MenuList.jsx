import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MenuItemCard from "./MenuItemCard";
import DetailsModal from "./DetailsModal";

const MenuList = ({ ids, limit, showFilters = true }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user } = useAuth();
  const { addToCart } = useCart();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/menu`);
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching menu:", err);
        toast.error("Server error while loading menu.");
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleReloadFavorites = (e) => {
      const ids = Array.isArray(e.detail) ? e.detail : [];
      setFavorites(ids);
    };
    window.addEventListener("reloadFavorites", handleReloadFavorites);
    return () => {
      window.removeEventListener("reloadFavorites", handleReloadFavorites);
    };
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axios.get(`${API_URL}/favorites/${user.id}`);
        setFavorites((data || []).map((f) => f.menu_id));
      } catch (e) {
        console.error("Favorites load error:", e);
      }
    };
    loadFavorites();
  }, [user]);

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((item) => item.category).filter(Boolean))],
    [menuItems]
  );

  // Visible items with filters
  const visibleItems = useMemo(() => {
    let list = ids ? menuItems.filter((i) => ids.includes(i.id)) : menuItems;
    if (showFilters) {
      list = list.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
    }
    return limit ? list.slice(0, limit) : list;
  }, [menuItems, ids, limit, searchQuery, selectedCategory, showFilters]);

  const toggleFavorite = (itemId) => {
    if (!user) {
      toast.error("Please log in to add favorites.");
      return;
    }
    const isFav = favorites.includes(itemId);
    setFavorites((prev) => {
      if (isFav) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
    const persist = async () => {
      try {
        if (isFav) {
          await axios.delete(`${API_URL}/favorites`, {
            data: { user_id: user.id, menu_id: itemId },
          });
          toast.success("Removed from favorites");
        } else {
          await axios.post(`${API_URL}/favorites`, {
            user_id: user.id,
            menu_id: itemId,
          });
          toast.success("Added to favorites");
        }
      } catch (e) {
        if (e?.response?.status === 409) {
          toast('Already in favorites', { icon: '❤️' });
          return;
        }
        console.error("Favorite persist error:", e);
      }
    };
    persist();
  };

  // Add to cart
  const handleAddToCart = (item) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    addToCart(item);
  };

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-12 w-full max-w-2xl mx-auto">
          <div className="relative flex items-center group">
            <input
              type="text"
              placeholder="Search delicious dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-foodie-primary/20 text-lg shadow-lg bg-white border-2 border-transparent focus:border-foodie-primary/50 transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border-2 ${
                  selectedCategory === category
                    ? "bg-foodie-primary border-foodie-primary text-white shadow-lg"
                    : "bg-white border-gray-100 text-gray-600 hover:border-foodie-primary hover:text-foodie-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xl font-medium">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {visibleItems.map((item) => (
    <div key={item.id} className="h-full">
      <MenuItemCard
        item={item}
        onAddToCart={() => handleAddToCart(item)}
        onToggleFavorite={toggleFavorite}
        onViewDetails={setSelectedItem}
        isFavorite={favorites.includes(item.id)}
      />
    </div>
  ))}
</div>
      )}

      {selectedItem && (
        <DetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={() => handleAddToCart(selectedItem)}
        />
      )}
    </div>
  );
};

export default MenuList;
