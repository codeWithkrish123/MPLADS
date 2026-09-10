import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Notification {
  id: string;
  type: "completion" | "update" | "delay" | "milestone";
  projectName: string;
  projectId: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
}

export const UserNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "N001",
      type: "completion",
      projectName: "School Building Renovation",
      projectId: "PRJ003",
      title: "Project Completed!",
      description:
        "The school renovation project has been successfully completed ahead of schedule.",
      timestamp: "2024-01-15T10:30:00",
      read: false,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      id: "N002",
      type: "update",
      projectName: "Community Water Supply System",
      projectId: "PRJ001",
      title: "Progress Update",
      description:
        "Work has progressed to 65% completion. Foundation work completed, pipeline installation in progress.",
      timestamp: "2024-01-12T14:20:00",
      read: false,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      id: "N003",
      type: "delay",
      projectName: "Health Centre Upgrade",
      projectId: "PRJ004",
      title: "Project Delay Notice",
      description:
        "The project is behind schedule due to monsoon weather conditions. New expected completion: July 2024.",
      timestamp: "2024-01-10T09:15:00",
      read: false,
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      id: "N004",
      type: "milestone",
      projectName: "Rural Road Improvement Project",
      projectId: "PRJ002",
      title: "Project Sanctioned",
      description:
        "The project has been officially sanctioned by the district authority.",
      timestamp: "2024-01-08T11:45:00",
      read: true,
      icon: CheckCircle2,
      color: "text-purple-600",
    },
  ]);

  const [filterType, setFilterType] = useState<string>("all");
  const [showRead, setShowRead] = useState(true);

  const filteredNotifications = notifications.filter((n) => {
    const typeMatch = filterType === "all" || n.type === filterType;
    const readMatch = showRead || !n.read;
    return typeMatch && readMatch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "completion":
        return "Completed";
      case "update":
        return "Update";
      case "delay":
        return "Delay Alert";
      case "milestone":
        return "Milestone";
      default:
        return "Notification";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "completion":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delay":
        return "bg-red-100 text-red-800";
      case "milestone":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const timeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Tricolor Header */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] mb-8 rounded-full" />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Updates</h1>
          <p className="text-gray-600 mt-1">
            Stay informed about all changes to your tracked projects
          </p>
        </div>
        <div className="bg-blue-100 rounded-full p-4">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Notifications</option>
              <option value="completion">Completed Projects</option>
              <option value="update">Progress Updates</option>
              <option value="delay">Delay Alerts</option>
              <option value="milestone">Milestones</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show read</span>
            </label>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border-l-4 p-4 cursor-pointer transition-all ${
                notification.read
                  ? "bg-gray-50 border-gray-300"
                  : "bg-white border-blue-500 shadow-md hover:shadow-lg"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    notification.read ? "bg-gray-100" : "bg-blue-50"
                  }`}
                >
                  <notification.icon
                    className={`w-5 h-5 ${notification.color}`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">
                          {notification.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.projectName}
                      </p>
                      <p className="text-sm text-gray-700">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {timeAgo(notification.timestamp)}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      View Project
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-700 font-medium">
                      Subscribe to Updates
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications to display</p>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-amber-900 mb-3">Notification Settings</h3>
        <p className="text-sm text-amber-800 mb-4">
          You can customize which projects you want to receive updates about.
          Visit your profile settings to manage your preferences.
        </p>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Go to Settings
        </button>
      </div>
    </div>
  );
};
