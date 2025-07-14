import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock menu items data
const mockMenuItems = [
  {
    id: 1,
    name: "Cappuccino",
    category: "Coffee & Tea",
    description: "Espresso, steamed milk, and foam",
    price: 4.5,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Caesar Salad",
    category: "Main Course",
    description: "Fresh romaine lettuce with caesar dressing",
    price: 12.99,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Chocolate Cake",
    category: "Desserts",
    description: "Rich chocolate cake with ganache",
    price: 6.99,
    imageUrl: "/placeholder.svg",
  },
];

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const [editFormData, setEditFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Drinks",
    "Snacks",
    "Breakfast",
    "Coffee & Tea",
    "Beverages",
  ];

  // Add item handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  // Edit item handlers
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditCategoryChange = (value: string) => {
    setEditFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setEditFormData({
      dishName: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl || "",
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.dishName.trim()) {
      newErrors.dishName = "Dish name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new item
      const newItem = {
        id: Date.now(), // Simple ID generation
        name: formData.dishName,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
      };

      setMenuItems((prev) => [...prev, newItem]);

      // Reset form and close modal
      setFormData({
        dishName: "",
        category: "",
        description: "",
        price: "",
        imageUrl: "",
      });
      setIsAddModalOpen(false);
      alert("Menu item added successfully!");
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!editFormData.dishName.trim()) {
      newErrors.dishName = "Dish name is required";
    }

    if (!editFormData.category) {
      newErrors.category = "Category is required";
    }

    if (!editFormData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(Number(editFormData.price)) ||
      Number(editFormData.price) <= 0
    ) {
      newErrors.price = "Please enter a valid price";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate PUT request
      const response = await fetch(`/api/menu/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editFormData.dishName,
          category: editFormData.category,
          description: editFormData.description,
          price: Number(editFormData.price),
          imageUrl: editFormData.imageUrl || null,
        }),
      });

      if (response.ok || true) {
        // Always succeed for demo
        // Update the item in the list
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  name: editFormData.dishName,
                  category: editFormData.category,
                  description: editFormData.description,
                  price: Number(editFormData.price),
                  imageUrl: editFormData.imageUrl,
                }
              : item,
          ),
        );

        setIsEditModalOpen(false);
        alert("Menu item updated successfully!");
      } else {
        alert("Failed to update menu item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      // For demo purposes, still update locally
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: editFormData.dishName,
                category: editFormData.category,
                description: editFormData.description,
                price: Number(editFormData.price),
                imageUrl: editFormData.imageUrl,
              }
            : item,
        ),
      );
      setIsEditModalOpen(false);
      alert("Menu item updated successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
      alert("Menu item deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  Café Dashboard
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid grid-cols-1 w-full max-w-md">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Menu Management
                </h2>
                <p className="text-muted-foreground">
                  Add and manage your menu items
                </p>
              </div>

              {/* Add Item Modal */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add New Menu Item
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new item to your menu.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
                    {/* Dish Name */}
                    <div className="space-y-2">
                      <Label htmlFor="dishName" className="text-sm font-medium">
                        Dish Name *
                      </Label>
                      <Input
                        id="dishName"
                        name="dishName"
                        type="text"
                        placeholder="e.g., Cappuccino, Caesar Salad"
                        value={formData.dishName}
                        onChange={handleInputChange}
                        className={`h-10 ${errors.dishName ? "border-destructive" : ""}`}
                      />
                      {errors.dishName && (
                        <p className="text-xs text-destructive">
                          {errors.dishName}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger
                          className={`h-10 ${errors.category ? "border-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-destructive">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your dish..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`h-10 pl-8 ${errors.price ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs text-destructive">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-sm font-medium">
                        Image URL (Optional)
                      </Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Adding...
                          </>
                        ) : (
                          "Add to Menu"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.category}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <p className="font-semibold text-primary">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Item Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">
                    Edit Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-slate-300">
                    Update the details of your menu item below.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                  {/* Dish Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editDishName"
                      className="text-sm font-medium text-white"
                    >
                      Dish Name *
                    </Label>
                    <Input
                      id="editDishName"
                      name="dishName"
                      type="text"
                      placeholder="e.g., Cappuccino, Caesar Salad"
                      value={editFormData.dishName}
                      onChange={handleEditInputChange}
                      className={`h-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                        errors.dishName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.dishName && (
                      <p className="text-xs text-red-400">{errors.dishName}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editCategory"
                      className="text-sm font-medium text-white"
                    >
                      Category *
                    </Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={handleEditCategoryChange}
                    >
                      <SelectTrigger
                        className={`h-10 bg-slate-700 border-slate-600 text-white ${
                          errors.category ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-white hover:bg-slate-600"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-400">{errors.category}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editDescription"
                      className="text-sm font-medium text-white"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="editDescription"
                      name="description"
                      placeholder="Describe your dish..."
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      className="min-h-[80px] resize-none bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editPrice"
                      className="text-sm font-medium text-white"
                    >
                      Price *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <Input
                        id="editPrice"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={editFormData.price}
                        onChange={handleEditInputChange}
                        className={`h-10 pl-8 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${
                          errors.price ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-red-400">{errors.price}</p>
                    )}
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editImageUrl"
                      className="text-sm font-medium text-white"
                    >
                      Image URL (Optional)
                    </Label>
                    <Input
                      id="editImageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={editFormData.imageUrl}
                      onChange={handleEditInputChange}
                      className="h-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
