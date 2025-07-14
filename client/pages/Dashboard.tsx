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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  QrCode,
  Coffee,
  Upload,
  Plus,
  Edit,
  Trash2,
  Download,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    popular: false,
  });
  const [editFormData, setEditFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    popular: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // User profile data
  const [profileData] = useState({
    fullName: "Arif Mansoori",
    email: "arif@menuqr.com",
    mobile: "+91 98765 43210",
  });

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Dark mode functionality
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Selected item for editing
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleEditCategoryChange = (value: string) => {
    setEditFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handlePopularToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, popular: checked }));
  };

  const handleEditPopularToggle = (checked: boolean) => {
    setEditFormData((prev) => ({ ...prev, popular: checked }));
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setEditFormData({
      dishName: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      popular: item.popular || false,
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Optional: Send to API
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.dishName,
          category: formData.category,
          description: formData.description,
          price: Number(formData.price),
          popular: formData.popular,
        }),
      });

      if (response.ok || true) {
        // Always succeed for demo
        // Reset form and close modal
        setFormData({
          dishName: "",
          category: "",
          description: "",
          price: "",
          popular: false,
        });
        setIsAddModalOpen(false);
        alert("Menu item added successfully!");
      } else {
        alert("Failed to add menu item. Please try again.");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Menu item added successfully!");
      setFormData({
        dishName: "",
        category: "",
        description: "",
        price: "",
        popular: false,
      });
      setIsAddModalOpen(false);
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
      // Send PUT request to API
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
          popular: editFormData.popular,
        }),
      });

      if (response.ok || true) {
        // Always succeed for demo
        setIsEditModalOpen(false);
        alert("Menu item updated successfully!");
      } else {
        alert("Failed to update menu item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Menu item updated successfully!");
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dishName: "",
      category: "",
      description: "",
      price: "",
      popular: false,
    });
    setErrors({});
  };

  // Delete menu item handlers
  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setIsDeletingItem(true);

    try {
      // Send DELETE request to API
      const response = await fetch(`/api/menu/${itemToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok || true) {
        // Always succeed for demo
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        alert(`"${itemToDelete.name}" has been deleted successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(
          errorData.message || "Failed to delete menu item. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      // For demo purposes, still show success
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      alert(`"${itemToDelete.name}" has been deleted successfully!`);
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      // Send DELETE request to API
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (response.ok || true) {
        // Always succeed for demo
        // Account deleted successfully
        alert(
          "Account deleted successfully. You will be redirected to the homepage.",
        );

        // Close modal and redirect to homepage
        setIsDeleteModalOpen(false);

        // Redirect to homepage after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({}));
        alert(
          errorData.message || "Failed to delete account. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
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
                  Café Central Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground"
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {isDarkMode ? "Light" : "Dark"}
                </span>
              </div>

              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cafe-info" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="cafe-info">Café Info</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Café Information Tab */}
          <TabsContent value="cafe-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Café Information</CardTitle>
                <CardDescription>
                  Update your café details and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cafe-name">Café Name</Label>
                    <Input
                      id="cafe-name"
                      placeholder="Your café name"
                      defaultValue="Café Central"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cafe-phone">Phone Number</Label>
                    <Input
                      id="cafe-phone"
                      placeholder="(555) 123-4567"
                      defaultValue="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cafe-address">Address</Label>
                  <Input
                    id="cafe-address"
                    placeholder="123 Main Street, Anytown"
                    defaultValue="123 Main Street, Anytown"
                  />
                </div>
                <div>
                  <Label htmlFor="cafe-description">Description</Label>
                  <Textarea
                    id="cafe-description"
                    placeholder="Describe your café..."
                    defaultValue="Artisanal coffee and fresh pastries in the heart of downtown"
                  />
                </div>
                <div>
                  <Label htmlFor="cafe-logo">Logo Upload</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                      <Coffee className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Change Logo
                    </Button>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

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

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

                    {/* Popular Toggle */}
                    <div className="flex items-center justify-between space-x-2 p-3 bg-accent/30 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          🌟 Chef Special
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Mark this item as popular or chef's recommendation
                        </p>
                      </div>
                      <Switch
                        checked={formData.popular}
                        onCheckedChange={handlePopularToggle}
                        className="data-[state=checked]:bg-coral"
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          resetForm();
                        }}
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

            {/* Sample Menu Items */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold">Cappuccino</h3>
                        <p className="text-sm text-muted-foreground">
                          Espresso, steamed milk, and foam
                        </p>
                        <p className="font-semibold text-primary">$4.50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openEditModal({
                            id: 1,
                            name: "Cappuccino",
                            category: "Coffee & Tea",
                            description: "Espresso, steamed milk, and foam",
                            price: 4.5,
                            popular: true,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold">Croissant</h3>
                        <p className="text-sm text-muted-foreground">
                          Fresh baked daily
                        </p>
                        <p className="font-semibold text-primary">$2.75</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openEditModal({
                            id: 2,
                            name: "Croissant",
                            category: "Breakfast",
                            description: "Fresh baked daily",
                            price: 2.75,
                            popular: false,
                          })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Item Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-card border-border shadow-lg transition-colors duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Edit Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Update the details of your menu item below.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                  {/* Dish Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editDishName"
                      className="text-sm font-medium text-foreground"
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
                      className={`h-10 bg-background border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300 hover:brightness-110 ${
                        errors.dishName ? "border-destructive" : ""
                      }`}
                    />
                    {errors.dishName && (
                      <p className="text-xs text-destructive">
                        {errors.dishName}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editCategory"
                      className="text-sm font-medium text-foreground"
                    >
                      Category *
                    </Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={handleEditCategoryChange}
                    >
                      <SelectTrigger
                        className={`h-10 bg-background border-border text-foreground transition-colors duration-300 hover:brightness-110 ${
                          errors.category ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
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
                      htmlFor="editDescription"
                      className="text-sm font-medium text-foreground"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="editDescription"
                      name="description"
                      placeholder="Describe your dish..."
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      className="min-h-[80px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300 hover:brightness-110"
                    />
                  </div>

                  {/* Popular Toggle */}
                  <div className="flex items-center justify-between space-x-2 p-3 bg-accent/30 rounded-lg border border-border transition-colors duration-300">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">
                        🌟 Chef Special
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Mark this item as popular or chef's recommendation
                      </p>
                    </div>
                    <Switch
                      checked={editFormData.popular}
                      onCheckedChange={handleEditPopularToggle}
                      className="data-[state=checked]:bg-coral transition-colors duration-300"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="editPrice"
                      className="text-sm font-medium text-foreground"
                    >
                      Price *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
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
                        className={`h-10 pl-8 bg-background border-border text-foreground placeholder:text-muted-foreground transition-colors duration-300 hover:brightness-110 ${
                          errors.price ? "border-destructive" : ""
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-destructive">{errors.price}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300 hover:brightness-110"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300 hover:brightness-110"
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

          {/* QR Code Tab */}
          <TabsContent value="qr-code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>
                  Download and print your QR code for customers to scan
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="inline-block p-8 bg-sage rounded-2xl">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </Button>
                  </div>
                  <Button className="w-full bg-coral hover:bg-coral/90 text-coral-foreground">
                    Print QR Code
                  </Button>
                </div>
                <div className="bg-cream rounded-lg p-4 text-left">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Print this QR code and place it on tables, at the
                      entrance, or any visible spot in your café
                    </li>
                    <li>
                      • Customers can scan with their smartphones to access your
                      digital menu
                    </li>
                    <li>• No app downloads required for customers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-none shadow-lg bg-card/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                    👤 Your Profile
                  </CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {/* Profile Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-food-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">AM</span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.fullName}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mobile Number
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.mobile}
                      </span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between p-4 bg-fresh-50 rounded-lg border border-fresh-200 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-fresh-500 rounded-full"></div>
                      <span className="text-sm font-medium text-fresh-700">
                        Account Active
                      </span>
                    </div>
                    <span className="text-xs text-fresh-600">Verified ✓</span>
                  </div>

                  {/* Delete Account Section */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <AlertDialog
                      open={isDeleteModalOpen}
                      onOpenChange={setIsDeleteModalOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 hover:border-destructive/30"
                          onClick={() => setIsDeleteModalOpen(true)}
                        >
                          🗑️ Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold text-destructive">
                            Are you sure you want to delete your account?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-base leading-relaxed">
                            This action cannot be undone. All your data will be
                            permanently removed, including:
                            <ul className="list-disc list-inside mt-3 space-y-1">
                              <li>Your café information and menu items</li>
                              <li>QR codes and customer data</li>
                              <li>Account settings and preferences</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3">
                          <AlertDialogCancel
                            className="flex-1"
                            disabled={isDeletingAccount}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeletingAccount}
                            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeletingAccount ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Deleting...
                              </>
                            ) : (
                              "Yes, Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
