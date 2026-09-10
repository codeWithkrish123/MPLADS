import React, { useState, useEffect } from "react";
import {
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  MapPinned,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedDistrict, setSelectedDistrict] = useState("New Delhi");
  const [searchTerm, setSearchTerm] = useState("");
  const isHindi = false;

  // Mock data for public user projects
  const nearbyProjects = [
    {
      id: "PRJ001",
      name: "Community Water Supply System",
      district: "New Delhi",
      state: "Delhi",
      category: "Drinking Water Facility",
      status: "In Progress",
      progress: 65,
      startDate: "2024-01-15",
      expectedCompletion: "2024-09-30",
      cost: "₹45 Lakh",
      distance: "2.5 km",
      description: "Installation of piped water supply system in residential area",
    },
    {
      id: "PRJ002",
      name: "Rural Road Improvement Project",
      district: "Gurgaon",
      state: "Haryana",
      category: "Rural Road Improvement",
      status: "Sanctioned",
      progress: 20,
      startDate: "2024-03-01",
      expectedCompletion: "2025-02-28",
      cost: "₹2 Crore",
      distance: "5.8 km",
      description: "Widening and improvement of approach road to village",
    },
    {
      id: "PRJ003",
      name: "School Building Renovation",
      district: "New Delhi",
      state: "Delhi",
      category: "School Building Renovation",
      status: "Completed",
      progress: 100,
      startDate: "2023-06-15",
      expectedCompletion: "2024-01-15",
      cost: "₹85 Lakh",
      distance: "1.2 km",
      description: "Complete renovation of primary school building with modern facilities",
    },
    {
      id: "PRJ004",
      name: "Health Centre Upgrade",
      district: "New Delhi",
      state: "Delhi",
      category: "Primary Health Centre Upgrade",
      status: "Delayed",
      progress: 45,
      startDate: "2023-12-01",
      expectedCompletion: "2024-06-30",
      cost: "₹60 Lakh",
      distance: "3.1 km",
      description: "Addition of diagnostic equipment and staff quarters",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Sanctioned":
        return "bg-purple-100 text-purple-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "In Progress":
        return <TrendingUp className="w-4 h-4" />;
      case "Delayed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProjects = nearbyProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Tricolor Header */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] mb-8 rounded-full" />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 md:p-8 mb-8 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to MPLADS Sentinel</h1>
            <p className="text-blue-100">
              Track public development projects in your area and monitor progress
            </p>
          </div>
          <Users className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Projects Nearby</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {filteredProjects.length}
              </p>
            </div>
            <MapPinned className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {filteredProjects.filter((p) => p.status === "Completed").length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {filteredProjects.filter((p) => p.status === "In Progress").length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delayed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {filteredProjects.filter((p) => p.status === "Delayed").length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Projects
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Delhi</option>
              <option>Haryana</option>
              <option>Punjab</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>New Delhi</option>
              <option>Gurgaon</option>
              <option>Noida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Projects Near You ({filteredProjects.length})
        </h2>

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="grid md:grid-cols-12 gap-6">
              {/* Project Info */}
              <div className="md:col-span-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.district}, {project.state}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-600">Category</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.distance}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Budget</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.cost}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Progress */}
              <div className="md:col-span-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        project.progress >= 75
                          ? "bg-green-500"
                          : project.progress >= 50
                          ? "bg-blue-500"
                          : project.progress >= 25
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-slate-900">
                      {new Date(project.startDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Expected Completion</p>
                    <p className="font-medium text-slate-900">
                      {new Date(project.expectedCompletion).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700">{project.description}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                View Details
              </button>
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 rounded-lg transition-colors">
                Subscribe for Updates
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-3">About MPLADS Sentinel</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            ✓ View all public development projects in your area tracked under
            MPLADS scheme
          </li>
          <li>✓ Monitor project progress and completion status in real-time</li>
          <li>
            ✓ Subscribe to get updates about projects near you automatically
          </li>
          <li>✓ Access project details, timelines, and budget information</li>
          <li>
            ✓ Report issues or feedback directly to implementation agencies
          </li>
        </ul>
      </div>
    </div>
  );
};
