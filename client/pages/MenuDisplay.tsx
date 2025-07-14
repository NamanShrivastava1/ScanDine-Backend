import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coffee, Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the café menu
const cafeData = {
  name: "The Daily Grind",
  address: "123 Main Street, Anytown",
  rating: 4.8,
  hours: "7:00 AM - 6:00 PM",
  logo: "/placeholder.svg",
  description: "Artisanal coffee and fresh pastries in the heart of downtown",
};

const menuCategories = [
  {
    name: "Coffee & Espresso",
    items: [
      {
        id: 1,
        name: "Cappuccino",
        price: 4.5,
        description: "Espresso, steamed milk, and a touch of foam",
        image: "/placeholder.svg",
        popular: true,
      },
      {
        id: 2,
        name: "Macchiato",
        price: 3.75,
        description: "Espresso with a dollop of foamed milk",
        image: "/placeholder.svg",
      },
      {
        id: 3,
        name: "Americano",
        price: 3.0,
        description: "Espresso and hot water",
        image: "/placeholder.svg",
      },
      {
        id: 4,
        name: "Latte",
        price: 4.0,
        description: "Espresso with steamed milk",
        image: "/placeholder.svg",
      },
    ],
  },
  {
    name: "Specialty Drinks",
    items: [
      {
        id: 5,
        name: "Iced Matcha Latte",
        price: 5.25,
        description: "Premium matcha powder with steamed milk over ice",
        image: "/placeholder.svg",
        popular: true,
      },
      {
        id: 6,
        name: "Caramel Macchiato",
        price: 5.5,
        description:
          "Vanilla syrup, steamed milk, espresso, and caramel drizzle",
        image: "/placeholder.svg",
      },
    ],
  },
  {
    name: "Pastries & Snacks",
    items: [
      {
        id: 7,
        name: "Croissant",
        price: 2.75,
        description: "Buttery, flaky pastry baked fresh daily",
        image: "/placeholder.svg",
      },
      {
        id: 8,
        name: "Blueberry Muffin",
        price: 3.25,
        description: "Fresh blueberries in a tender, sweet muffin",
        image: "/placeholder.svg",
        popular: true,
      },
    ],
  },
];

export default function MenuDisplay() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  {cafeData.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{cafeData.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{cafeData.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Café Info */}
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

      {/* Menu Categories */}
      <div className="container mx-auto px-4 pb-8">
        {menuCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {category.name}
            </h2>
            <div className="grid gap-4">
              {category.items.map((item) => (
                <Card
                  key={item.id}
                  className="border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {item.name}
                            </CardTitle>
                            {item.popular && (
                              <Badge
                                variant="secondary"
                                className="bg-coral text-coral-foreground text-xs px-2 py-1"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-primary">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {item.description}
                        </CardDescription>
                      </div>
                      <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
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

      {/* Bottom Actions */}
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
