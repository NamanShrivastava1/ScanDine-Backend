import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { QrCode, Search as SearchIcon, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/dashboard/public-cafes",
        );
        console.log("Fetched cafes:", response.data.cafes);
        setCafes(response.data.cafes);
      } catch (error) {
        console.error("Failed to fetch cafes", error);
      }
    };

    fetchCafes();
  }, []);

  const cafeImages = [
    "/uploads/cafe1.jpg",
    "/uploads/cafe2.jpg",
    "/uploads/cafe3.jpg",
    "/uploads/cafe4.jpg",
    "/uploads/cafe5.jpg",
  ];

  function getImageForCafe(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    return cafeImages[hash % cafeImages.length];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                ScanDine
              </span>
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">For Owners</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Cafés Near You
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover local cafés and restaurants with digital menus
          </p>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by café name or city..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid gap-4 max-w-4xl mx-auto">
          {cafes.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg">
              No cafés found.
            </p>
          ) : (
            cafes.map((cafe) => (
              <Card
                key={cafe._id}
                className="border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={getImageForCafe(cafe._id)}
                        alt={cafe.cafename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">
                          {cafe.cafename}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>Not Rated</span>{" "}
                          {/* Replace with real rating if available */}
                        </div>
                      </div>
                      <div className="text-muted-foreground mb-3">
                        {cafe.description && (
                          <p className="text-sm mb-1">{cafe.description}</p>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{cafe.address}</span>
                        </div>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Link to={`/menu/${cafe._id}`}>View Menu</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
