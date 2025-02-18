"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiArrowLeftCircle, FiSearch } from "react-icons/fi";
import { BiDollar } from "react-icons/bi";
import { Variant } from "@/types/variants.type";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/services/productsService";
import {
  createVariantForProduct,
  deleteVariant,
} from "@/services/variantsService";
import { useRouter } from "next/navigation";
import { Product } from "@/types/products.type";

interface FormState {
  color: string;
  capacity: string;
  price: string;
  stock: string;
  active: boolean;
  default: boolean;
}

const ProductVariantManagement = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<FormState>({
    color: "",
    capacity: "",
    price: "",
    stock: "",
    active: true,
    default: false,
  });

  interface FormErrors {
    color?: string;
    capacity?: string;
    price?: string;
    stock?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProductVariants = async () => {
      if (typeof productId === "string") {
        try {
          const product = await fetchProductById(productId);
          setProduct(product);
          setVariants(product.variants);
        } catch (error) {
          console.error("Error fetching product variants:", error);
        }
      } else {
        console.error("Invalid productId:", productId);
      }
    };

    fetchProductVariants();
  }, [productId]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || parseFloat(formData.stock) < 0)
      newErrors.stock = "Valid stock is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        if (typeof productId === "string") {
          const newVariant = await createVariantForProduct(productId, {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseFloat(formData.stock),
          });

          if (formData.default) {
            const updatedVariants = variants.map((v) => ({
              ...v,
              isDefault: false,
            }));
            setVariants(updatedVariants);
          }
          setVariants([...variants, newVariant]);
        }
        setFormData({
          color: "",
          capacity: "",
          price: "",
          stock: "",
          active: true,
          default: false,
        });
        setErrors({});
      } catch (error) {
        console.error("Error creating variant:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteVariant(id);
  };

  const handleEdit = () => {
    // setFormData(variant);
  };

  const handleBack = () => {
    router.push("/administrator/products");
  };

  const filteredVariants = variants.filter(
    (variant) =>
      variant.capacity.toLowerCase().includes(search.toLowerCase()) ||
      variant.color.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVariants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-heading font-heading text-foreground mb-8">
            Product Variant Management
          </h1>
          <button
            onClick={() => handleBack()}
            className="p-1 text-2xl hover:text-destructive"
          >
            <FiArrowLeftCircle />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-heading mb-6">Add New Variant</h2>
              <h2 className="text-lg text-primary font-heading mb-6">
                {product?.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-body mb-2">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 rounded border-input"
                  />
                  {errors.color && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.color}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body mb-2">
                    Capacity
                  </label>
                  <select
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="w-full p-2 rounded border-input bg-background"
                  >
                    <option value="">Select Capacity</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                  {errors.capacity && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body mb-2">Price</label>
                  <div className="relative">
                    <BiDollar className="absolute left-3 top-3 text-accent" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      className="w-full p-2 pl-8 rounded border-input bg-background"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border-input bg-background"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.stock}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="rounded border-input"
                    />
                    <span className="text-sm font-body">Active</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.default}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          default: e.target.checked,
                        })
                      }
                      className="rounded border-input"
                    />
                    <span className="text-sm font-body">Default</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Add Variant
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-heading">Variant List</h2>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-accent" />
                  <input
                    type="text"
                    placeholder="Search variants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 p-2 rounded border-input bg-background"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-input">
                      <th className="text-left p-2">Color</th>
                      <th className="text-left p-2">Capacity</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Stock</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((variant) => (
                      <tr key={variant.id} className="border-b border-input">
                        <td className="p-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: variant.color }}
                          />
                        </td>
                        <td className="p-2">{variant.capacity}</td>
                        <td className="p-2">${variant.price}</td>
                        <td className="p-2">{variant.stock}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              variant.active
                                ? "bg-chart-2 text-white"
                                : "bg-destructive text-white"
                            }`}
                          >
                            {variant.active ? "Active" : "Inactive"}
                          </span>
                          {variant.default && (
                            <span className="ml-2 px-2 py-1 rounded bg-primary text-white text-sm">
                              Default
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit()}
                              className="p-1 hover:text-primary"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(variant.id)}
                              className="p-1 hover:text-destructive"
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

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-accent">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredVariants.length)} of{" "}
                  {filteredVariants.length} variants
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastItem >= filteredVariants.length}
                    className="px-3 py-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantManagement;
