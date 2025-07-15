import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, ArrowLeft, Download, Printer, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";

export default function QRCodePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Mock café data - replace with real data later
  const cafeData = {
    id: "cafe-central-123",
    slug: "cafe-central",
    name: "Café Central",
    hasInfo: true,
    hasMenu: true,
  };

  const menuUrl = `https://menuqr.app/menu/${cafeData.slug}`;

  // Check if QR code exists on component mount
  useState(() => {
    const savedQrStatus = localStorage.getItem(`qr_generated_${cafeData.id}`);
    if (savedQrStatus === "true") {
      setQrCodeGenerated(true);
    }
  });

  const handleGenerateQR = async () => {
    setIsGenerating(true);

    try {
      // Simulate QR generation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would call a QR generation API
      // For now, we'll mark it as generated and save to localStorage
      setQrCodeGenerated(true);
      localStorage.setItem(`qr_generated_${cafeData.id}`, "true");

      alert("QR Code generated successfully!");
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, you would generate and download the QR code
      // For now, we'll just show a success message
      alert("QR Code downloaded as PNG!");
    } catch (error) {
      console.error("Error downloading PNG:", error);
      alert("Failed to download QR code. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSVG = async () => {
    setIsDownloading(true);

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, you would generate and download the QR code
      alert("QR Code downloaded as SVG!");
    } catch (error) {
      console.error("Error downloading SVG:", error);
      alert("Failed to download QR code. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);

    try {
      // Trigger browser print
      window.print();

      // Show success message after a short delay
      setTimeout(() => {
        alert("Print dialog opened!");
        setIsPrinting(false);
      }, 500);
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to open print dialog. Please try again.");
      setIsPrinting(false);
    }
  };

  // Check if café has required data
  const hasRequiredData = cafeData.hasInfo && cafeData.hasMenu;

  if (!hasRequiredData) {
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
                  <Link to="/dashboard">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">
                    QR Code Generator
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
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
              </div>
            </div>
          </div>
        </header>

        {/* Placeholder Content */}
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <Card className="w-full max-w-md border-none shadow-lg bg-card/70 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Setup Required
              </CardTitle>
              <CardDescription className="text-lg">
                Please add your café info or menu before generating a QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To generate your QR code, you need:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${cafeData.hasInfo ? "bg-fresh-500" : "bg-destructive"}`}
                  ></div>
                  Café information (name, address, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${cafeData.hasMenu ? "bg-fresh-500" : "bg-destructive"}`}
                  ></div>
                  At least one menu item
                </li>
              </ul>
              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link to="/dashboard">Complete Setup</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  QR Code Generator
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your QR Code
            </h1>
            <p className="text-lg text-muted-foreground">
              Download and print your QR code for customers to scan
            </p>
          </div>

          {/* QR Code Card */}
          <Card className="border-none shadow-lg bg-card/70 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              {/* QR Code Display */}
              <div className="flex justify-center mb-6">
                <div className="p-8 bg-sage rounded-2xl shadow-lg">
                  <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-56 h-56 bg-black rounded-lg flex items-center justify-center relative">
                      {/* QR Code Pattern - Simplified representation */}
                      <div className="grid grid-cols-8 gap-1 w-48 h-48">
                        {Array.from({ length: 64 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-full h-full ${
                              Math.random() > 0.5 ? "bg-black" : "bg-white"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Corner squares */}
                      <div className="absolute top-2 left-2 w-8 h-8 bg-black"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 bg-black"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 bg-black"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Café Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {cafeData.name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-md inline-block">
                  {menuUrl}
                </p>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3 mb-4">
                <Button
                  onClick={handleDownloadPNG}
                  disabled={isDownloading}
                  variant="outline"
                  className="flex-1 h-12 transition-colors duration-300 hover:brightness-110"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDownloadSVG}
                  disabled={isDownloading}
                  variant="outline"
                  className="flex-1 h-12 transition-colors duration-300 hover:brightness-110"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download SVG
                    </>
                  )}
                </Button>
              </div>

              {/* Print Button */}
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300 hover:brightness-110"
              >
                {isPrinting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Opening Print...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">How to use your QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-0.5"></span>
                  Print this QR code and place it on tables, at the entrance, or
                  any visible spot in your café
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-coral rounded-full flex-shrink-0 mt-0.5"></span>
                  Customers can scan with their smartphones to access your
                  digital menu
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-sage rounded-full flex-shrink-0 mt-0.5"></span>
                  No app downloads required for customers - works with any
                  camera app
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-food-500 rounded-full flex-shrink-0 mt-0.5"></span>
                  Update your menu anytime - QR code always points to the latest
                  version
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
