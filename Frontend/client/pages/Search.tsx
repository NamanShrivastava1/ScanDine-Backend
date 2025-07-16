import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, Search as SearchIcon, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for café search results
const mockCafes = [
  {
    id: 1,
    name: "The Daily Grind",
    address: "123 Main Street, Downtown",
    rating: 4.8,
    image: "/placeholder.svg",
    distance: "0.5 mi",
  },
  {
    id: 2,
    name: "Bella Trattoria",
    address: "456 Oak Avenue, Midtown",
    rating: 4.6,
    image: "/placeholder.svg",
    distance: "1.2 mi",
  },
  {
    id: 3,
    name: "Sweet Surrender",
    address: "789 Pine Street, Arts District",
    rating: 4.9,
    image: "/placeholder.svg",
    distance: "2.1 mi",
  },
];

export default function Search() {
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Nearby</h2>
          <p className="text-muted-foreground">
            {mockCafes.length} cafés found in your area
          </p>
        </div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {mockCafes.map((cafe) => (
            <Card
              key={cafe.id}
              className="border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{cafe.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{cafe.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{cafe.address}</span>
                      <span className="text-sm">• {cafe.distance}</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Link to="/menu">View Menu</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
