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
import { useEffect, useState } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    isChefSpecial: false,
  });
  const [editFormData, setEditFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    price: "",
    isChefSpecial: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  // User profile data
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Dark mode functionality
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Selected item for editing
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Delete menu item confirmation state
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
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

  interface CafeInfo {
    cafename: string;
    phoneNo: string;
    address: string;
    description: string;
    logo: string;
  }

  const [cafeinfo, setCafeinfo] = useState<CafeInfo>({
    cafename: "Café Central",
    phoneNo: "5551234567",
    address: "123 Main Street, Anytown",
    description: "Artisanal coffee and fresh pastries in the heart of downtown",
    logo: "",
  });

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

  const handleChefSpecialToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isChefSpecial: checked }));
  };

  const handleEditChefSpecialToggle = (checked: boolean) => {
    setEditFormData((prev) => ({ ...prev, isChefSpecial: checked }));
  };

  const openEditModal = (item: any) => {
    setSelectedItem({ ...item, id: item._id });
    setEditFormData({
      dishName: item.dishName,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      isChefSpecial: item.isChefSpecial || false,
    });
    setErrors({});
    setIsEditModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.dishName || !formData.category || formData.price === "") {
      alert("Please fill all required fields.");
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice)) {
      alert("Price must be a valid number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/dashboard/menu",
        {
          dishName: formData.dishName,
          category: formData.category,
          description: formData.description,
          price: numericPrice,
          isChefSpecial: formData.isChefSpecial,
        },
        {
          withCredentials: true, // Important: includes cookies
        },
      );

      alert("Menu item added successfully!");
      // You can reset form or fetch menu again here
    } catch (error) {
      // Handle backend validation errors
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const messages = error.response.data.errors
          .map((e) => e.msg)
          .join("\n");
        alert("Validation failed:\n" + messages);
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert("Error: " + error.response.data.message);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    // Validate form inputs
    if (!editFormData.dishName?.trim()) {
      newErrors.dishName = "Dish name is required";
    }

    if (!editFormData.category) {
      newErrors.category = "Category is required";
    }

    if (!editFormData.price?.toString().trim()) {
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

    const menuId = selectedItem._id || selectedItem.id;
    if (!menuId) {
      alert("⚠️ Menu item ID is missing. Cannot update.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Submitting Edit Form Data:", editFormData);

      const payload = {
        dishName: editFormData.dishName,
        category: editFormData.category,
        description: editFormData.description,
        price: Number(editFormData.price),
        isChefSpecial: editFormData.isChefSpecial,
      };

      if (editFormData.isChefSpecial !== undefined) {
        payload.isChefSpecial = editFormData.isChefSpecial === true;
      }

      console.log(menuId);
      const response = await axios.put(
        `http://localhost:4000/api/dashboard/menu/${selectedItem._id}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("📤 Payload Sent to Backend:", payload);

      // ✅ Success response
      if (response.status === 200) {
        const updatedItem = response.data.menu;
        console.log("✅ Updated Item from Backend:", updatedItem);

        // ✅ Update UI
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item._id === updatedItem._id ? updatedItem : item,
          ),
        );

        alert("✅ Menu item updated successfully!");
        setIsEditModalOpen(false);
      } else {
        alert("⚠️ Failed to update menu item. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Error updating menu item:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        alert(`⚠️ Update failed: ${errorMessage}`);
      } else {
        alert("⚠️ An unexpected error occurred while updating the menu item");
      }
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
      isChefSpecial: false,
    });
    setErrors({});
  };

  // Delete menu item handlers
  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteItemModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setIsDeletingItem(true);

    try {
      const response = await api.delete(`/menu/${itemToDelete._id}`);

      if (response.status === 200) {
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete._id),
        );
        setIsDeleteItemModalOpen(false);
        setItemToDelete(null);
        alert(`"${itemToDelete.dishName}" has been deleted successfully!`);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to delete menu item");
      } else {
        alert("An unexpected error occurred while deleting the menu item");
      }
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      const response = await axios.delete(
        "http://localhost:4000/api/users/delete",
        {
          withCredentials: true,
        },
      );

      if (response.data.status === 200) {
        alert("Your account has been deleted successfully!");
        navigate("/");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCafeinfo((prev) => ({ ...prev, [name]: value }));
  };

  const signOutHandler = async () => {
    const response = await axios.get("http://localhost:4000/api/users/logout", {
      withCredentials: true,
    });

    navigate("/signin");

    alert("You have been signed out successfully!");
    console.log(response);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/users/dashboard/profile",
        {
          withCredentials: true,
        },
      );
      setProfileData({
        fullname: response.data.user.fullname,
        email: response.data.user.email,
        mobile: response.data.user.mobile,
      });
      console.log(response);
    };

    getUserProfile();
  }, [formData]);

  const cafeInfoHandler = async () => {
    console.log("Sending cafe info:", cafeinfo);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/dashboard/cafeinfo",
        cafeinfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ REQUIRED for sending cookies
        },
      );

      // Optional: show success message or update UI
      console.log("Cafe added:", response.data);
    } catch (error) {
      console.error(
        "Error adding cafe:",
        error.response?.data || error.message,
      );
    }
  };

  const api = axios.create({
    baseURL: "http://localhost:4000/api/dashboard",
    withCredentials: true, // This sends cookies automatically
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      // Only fetch menu items, no cafe data needed
      const menuResponse = await api.get("/my-menu");
      setMenuItems(menuResponse.data.menuItems || []);
      console.log(menuResponse.data.menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);

      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        setError("No cafe found. Please create a cafe first.");
      } else {
        setError(error.response?.data?.message || "Failed to fetch menu data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await axios.get("/api/dashboard/showCafe", {
          withCredentials: true,
        });

        const { cafename, phoneNo, address, description, logo } = res.data.cafe;

        setCafeinfo({
          cafename: cafename || "Cafe Placeholder",
          phoneNo: phoneNo || "9876543210",
          address: address || "123 Main Street, Ujjain",
          description:
            description || "A cozy spot for great coffee and snacks.",
          logo: logo || "",
        });
      } catch (err) {
        console.error("Error fetching cafe data:", err.message);
        // Do not clear state so dummy values remain visible
      }
    };

    fetchCafe();
  }, []);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

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

              <Button onClick={signOutHandler} variant="outline" size="sm">
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
                      id="cafename"
                      name="cafename"
                      value={cafeinfo.cafename}
                      onChange={handleChange}
                      placeholder="Your café name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cafe-phone">Phone Number</Label>
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      value={cafeinfo.phoneNo}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cafe-address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={cafeinfo.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Anytown"
                  />
                </div>
                <div>
                  <Label htmlFor="cafe-description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={cafeinfo.description}
                    onChange={handleChange}
                    placeholder="Describe your café..."
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
                <div className="flex gap-3">
                  <Button
                    onClick={cafeInfoHandler}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Save Changes
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-sage text-sage hover:bg-sage/10"
                  >
                    <Link to="/dashboard/qrcode">Generate QR Code</Link>
                  </Button>
                </div>
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

                    {/* Chef Special Toggle */}
                    <div className="flex items-center justify-between space-x-2 p-3 bg-accent/30 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          🌟 Chef Special
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Mark this item as chef's special recommendation
                        </p>
                      </div>
                      <Switch
                        checked={formData.isChefSpecial}
                        onCheckedChange={handleChefSpecialToggle}
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
              {menuItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No menu items found. Add your first menu item!
                </div>
              ) : (
                menuItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg"></div>
                          <div>
                            <h3 className="font-semibold">{item.dishName}</h3>
                            {item.isChefSpecial && (
                              <span className="text-[10px] mt-2 mb-2 text-white bg-yellow-500 py-1 px-2 rounded-md">
                                Chef's Special
                              </span>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {item.description || "No description available"}
                            </p>
                            <p className="font-semibold text-primary">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openEditModal({
                                _id: item._id,
                                dishName: item.dishName,
                                category: item.category,
                                description: item.description,
                                price: item.price,
                                isChefSpecial: item.isChefSpecial,
                              })
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openDeleteModal({
                                _id: item._id,
                                dishName: item.dishName,
                                category: item.category,
                                description: item.description,
                                price: item.price,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
                      value={editFormData.dishName || ""}
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
                      value={editFormData.category || ""}
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
                      value={editFormData.description || ""}
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
                      checked={editFormData.isChefSpecial}
                      onCheckedChange={handleEditChefSpecialToggle}
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
                        value={editFormData.price || ""}
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

            {/* Delete Confirmation Modal */}
            <AlertDialog
              open={isDeleteItemModalOpen}
              onOpenChange={setIsDeleteItemModalOpen}
            >
              <AlertDialogContent className="sm:max-w-md bg-card border-border shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-destructive">
                    Are you sure you want to delete this item?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base leading-relaxed text-muted-foreground">
                    This action cannot be undone. The dish "{itemToDelete?.name}
                    " will be permanently removed from your menu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel
                    className="flex-1 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                    disabled={isDeletingItem}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteItem}
                    disabled={isDeletingItem}
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-300 hover:brightness-110"
                  >
                    {isDeletingItem ? (
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
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-coral hover:bg-coral/90 text-coral-foreground">
                      Print QR Code
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                    >
                      <Link to="/dashboard/qrcode">Generate QR Code</Link>
                    </Button>
                  </div>
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
                        {profileData.fullname}
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
