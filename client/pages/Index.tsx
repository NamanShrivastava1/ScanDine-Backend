import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            MenuQR Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your restaurant menu items with our easy-to-use dashboard.
            Add, edit, and organize your menu with just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Link to="/dashboard">View Menu Management</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Menu Management</h3>
            <p className="text-gray-600">
              Add, edit, and delete menu items with a simple interface
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Changes are reflected immediately in your menu
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Beautiful Design</h3>
            <p className="text-gray-600">
              Clean, modern interface that's easy to use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
