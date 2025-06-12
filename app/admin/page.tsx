"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    weeklySales: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    // In a real app, you would fetch these stats from your API
    // This is just a placeholder
    const fetchStats = async () => {
      try {
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        
        const weeklySalesRes = await fetch("/api/weekly-sales");
        const weeklySalesData = await weeklySalesRes.json();
        
        setStats({
          products: productsData.length || 0,
          weeklySales: weeklySalesData.products?.length || 0,
          users: 42, // Placeholder
          revenue: 15780 // Placeholder
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      description: "Products in inventory",
      icon: <Package className="h-8 w-8 text-blue-500" />,
      href: "/admin/products"
    },
    {
      title: "Weekly Sales",
      value: stats.weeklySales,
      description: "Products on sale this week",
      icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
      href: "/admin/weekly-sales"
    },
    {
      title: "Users",
      value: stats.users,
      description: "Registered users",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      href: "/admin/users"
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      description: "Total revenue",
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      href: "/admin/orders"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/admin/weekly-sales">
          <Button>Manage Weekly Sales</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={card.href} className="text-xs text-blue-600 hover:underline">
                View details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm">Weekly sale created</p>
                  <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm">New product added</p>
                  <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-sm">Order #1234 completed</p>
                  <p className="text-xs text-gray-500">Yesterday at 2:15 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/weekly-sales/create">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Create Weekly Sale
                </Button>
              </Link>
              <Link href="/admin/products/create">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
