

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import AdminUserManagement from "../components/AdminUserManagement";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://finence-tracker-2.onrender.com/api/analytics`, {
        withCredentials: true,
      });
      setAnalytics(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setAnalytics({
          summary: { income: 0, expenses: 0, balance: 0 },
          byCategory: [],
          monthlyTrends: [],
        });
      } else {
        setError(err.response?.data?.msg || "Error fetching analytics");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {user?.email}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Confirm Logout</h3>
                    <p className="text-gray-400">Are you sure you want to logout?</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-200 flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex-1"
                    >
                      Yes, Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-green-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="rounded-2xl bg-green-500/20 p-4 mr-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Income</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {formatCurrency(analytics?.summary?.income || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-red-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="rounded-2xl bg-red-500/20 p-4 mr-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Expenses</p>
                <p className="text-3xl font-bold text-red-400 mt-1">
                  {formatCurrency(analytics?.summary?.expenses || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="rounded-2xl bg-blue-500/20 p-4 mr-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Balance</p>
                <p className={`text-3xl font-bold mt-1 ${(analytics?.summary?.balance || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(analytics?.summary?.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
              Income vs Expenses
            </h3>
            <IncomeExpenseBarChart
              data={analytics?.summary || { income: 0, expenses: 0 }}
            />
          </div>

          {/* Category Pie Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-teal-400 rounded-full"></div>
              Spending by Category
            </h3>
            <CategoryPieChart
              data={analytics?.byCategory?.filter((item) => item.type === "expense") || []}
            />
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full"></div>
              Monthly Trends
            </h3>
            <TrendLineChart data={analytics?.monthlyTrends || []} />
          </div>
        </div>

        {/* Empty State */}
        {analytics?.summary?.income === 0 && analytics?.summary?.expenses === 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center mb-8 shadow-2xl border border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Welcome to WealthWise!</h3>
              <p className="text-gray-400 mb-6">
                Start your financial journey by adding your first transaction to track your income and expenses.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Transactions Section */}
        <div className="mb-8">
          <TransactionForm onTransactionAdded={fetchAnalytics} />
        </div>

        <div>
          <TransactionList fetchAnalytics={fetchAnalytics} />
        </div>
        // Then inside your Dashboard component's return statement
        {user && user.role === "admin" && (
          <div className="mb-8">
            <AdminUserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;