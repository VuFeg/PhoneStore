"use client";

import React, { useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { BiCategory, BiPackage, BiUser, BiCog } from "react-icons/bi";
import SidebarItem from "./components/SidebarItem";
import ProductModal from "./components/ProductModal";
import Link from "next/link";

// Mô phỏng dữ liệu (có thể thay thế bằng gọi API sau này)
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    published: true,
    createdAt: "2024-01-15",
    image: "image_url_1.jpg",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    published: false,
    createdAt: "2024-01-16",
    image: "image_url_2.jpg",
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    published: true,
    createdAt: "2024-01-17",
    image: "image_url_3.jpg",
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<{
    id?: number;
    name: string;
    published: boolean;
    createdAt: string;
    image?: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleEditProduct = (product: {
    id: number;
    name: string;
    published: boolean;
    createdAt: string;
    image?: string;
  }) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 p-4 border-r border-border ${
            sidebarOpen ? "w-64" : "w-20"
          } bg-card`}
        >
          <div className="flex items-center justify-between mb-8">
            <h1
              className={`${
                sidebarOpen ? "block" : "hidden"
              } text-xl font-bold text-foreground`}
            >
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <FiMenu className="text-foreground" />
            </button>
          </div>
          <nav>
            <SidebarItem
              icon={<BiPackage />}
              text="Products"
              active={true}
              expanded={sidebarOpen}
            />
            <SidebarItem
              icon={<BiCategory />}
              text="Categories"
              active={false}
              expanded={sidebarOpen}
            />
            <SidebarItem
              icon={<BiUser />}
              text="Customers"
              active={false}
              expanded={sidebarOpen}
            />
            <SidebarItem
              icon={<BiCog />}
              text="Settings"
              active={false}
              expanded={sidebarOpen}
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Product Management
              </h2>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/products/create"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <FiPlus /> Add Product
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-foreground">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-foreground">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-foreground">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-foreground">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.published ? (
                          <FiCheck className="text-chart-2 w-5 h-5" />
                        ) : (
                          <FiX className="text-destructive w-5 h-5" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-accent hover:text-primary rounded-lg hover:bg-secondary"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-accent hover:text-destructive rounded-lg hover:bg-secondary"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-accent">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-input disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastItem >= filteredProducts.length}
                  className="px-4 py-2 rounded-lg border border-input disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
