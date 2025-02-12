"use client";

import React, { useState, useEffect } from "react";
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
import SidebarItem from "../../../components/admin/SidebarItem";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter từ next/navigation
import { deleteProduct, fetchProducts } from "@/services/productsService";
import { Product } from "@/types/products";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

const ProductManagement = () => {
  const router = useRouter(); // Khởi tạo router
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setProducts(
          products.filter((product) => product.id !== productToDelete.id)
        );
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Hàm handleEditProduct sử dụng router.push để chuyển hướng đến trang edit
  const handleEditProduct = (product: Product) => {
    router.push(`/administrator/products/edit/${product.id}`);
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
                  href="/administrator/products/create"
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
                  {currentItems.map((product: Product) => (
                    <tr key={product.id} className="hover:bg-secondary/5">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.image_urls &&
                          product.image_urls.length > 0 && (
                            <img
                              src={product.image_urls[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                      </td>
                      <td className="px-6 py-4">
                        {product.public ? (
                          <FiCheck className="text-chart-2 w-5 h-5" />
                        ) : (
                          <FiX className="text-destructive w-5 h-5" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {new Date(product.created_at).toLocaleDateString()}
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
                            onClick={() => handleDeleteProduct(product)}
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

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        itemName={productToDelete?.name}
      />
    </div>
  );
};

export default ProductManagement;
