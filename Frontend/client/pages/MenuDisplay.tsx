import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Coffee, MapPin } from "lucide-react";

type MenuItem = {
  _id: string;
  dishName: string;
  description: string;
  price: number;
  image?: string;
  isChefSpecial?: boolean;
};

type MenuCategory = {
  category: string;
  items: MenuItem[];
};

type Cafe = {
  _id: string;
  cafename: string;
  address: string;
  description?: string;
};

export default function MenuDisplay() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const [cafeData, setCafeData] = useState<Cafe | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafeAndMenu = async () => {
      try {
        const [cafesRes, menuRes] = await Promise.all([
          axios.get("http://localhost:4000/api/dashboard/public-cafes"),
          axios.get(
            `http://localhost:4000/api/dashboard/public-menu/${cafeId}`,
          ),
        ]);

        const allCafes = cafesRes.data.cafes;
        const selectedCafe = allCafes.find((cafe: Cafe) => cafe._id === cafeId);

        setCafeData(selectedCafe || null);
        setMenuCategories(menuRes.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (cafeId) fetchCafeAndMenu();
  }, [cafeId]);

  if (loading || !cafeData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <svg
          className="animate-spin h-8 w-8 mb-4 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p className="text-sm">Loading menu...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/search">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {cafeData.cafename}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {cafeData.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-6">
        <Card className="border-none shadow-sm bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{cafeData.address}</span>
            </div>
            <p className="text-muted-foreground">{cafeData.description}</p>
          </CardContent>
        </Card>
      </section>

      <div className="container mx-auto px-4 pb-8">
        {menuCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {category.category}
            </h2>
            <div className="grid gap-4">
              {category.items.map((item) => (
                <Card
                  key={item._id}
                  className="border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">
                            {item.dishName}
                          </CardTitle>
                          <span className="text-lg font-semibold text-primary">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {item.description}
                        </CardDescription>
                        {item.isChefSpecial && (
                          <span className="text-[10px] mt-2 inline-flex items-center gap-1 text-white bg-yellow-500 py-1 px-2 rounded-md">
                            🍽️ Chef's Special
                          </span>
                        )}
                      </div>
                      <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={`http://localhost:4000/uploads/menu/${encodeURIComponent(category.category)}.jpg`}
                          alt={item.dishName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/search">Browse More Cafés</Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link to="/dashboard">Own a Café?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
