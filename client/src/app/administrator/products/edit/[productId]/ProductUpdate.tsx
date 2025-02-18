"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, updateProduct } from "@/services/productsService";
import { uploadImage, deleteImage } from "@/services/mediaService";
import Image from "next/image";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  // Lấy productId từ URL động
  const { productId } = useParams();
  const router = useRouter();

  // State cho form update sản phẩm
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  // images: mảng file với thuộc tính preview, dùng để lưu tối đa 3 ảnh
  const [images, setImages] = useState<(File & { preview?: string })[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (typeof productId === "string") {
        try {
          const product = await fetchProductById(productId);
          setProductName(product.name);
          setDescription(product.description);
          setIsPublished(product.public);
          setImages(
            product.image_urls.map((url) => ({
              ...new File([], ""), // Create a dummy File object
              preview: url,
            }))
          );
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      } else {
        console.error("Invalid productId:", productId);
      }
    };

    loadProduct();
  }, [productId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!productName) newErrors.productName = "Product name is required";
    if (productName.length > 100)
      newErrors.productName = "Product name cannot exceed 100 characters";
    if (description.length < 50)
      newErrors.description = "Description must be at least 50 characters";
    if (description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";
    if (images.length === 0)
      newErrors.image = "Please upload at least one image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    for (const file of validFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadImage(formData);
        const newImage = {
          ...file,
          preview: response.url,
        };
        setImages((prev) => [...prev, newImage].slice(0, 3));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 3,
  });

  const removeImageAt = async (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      try {
        const filename = imageToRemove.preview.split("/").pop(); // Extract the filename from the URL
        if (filename) {
          await deleteImage(filename);
          console.log("Image deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const updatedProduct = {
          name: productName,
          description,
          image_urls: images.map((img) => img.preview || ""),
          public: isPublished,
        };
        if (typeof productId === "string") {
          await updateProduct(productId, updatedProduct);
          toast.success("Product updated successfully", {
            position: "top-center",
            autoClose: 3000,
          });
          router.push("/administrator/products");
        } else {
          console.error("Invalid productId:", productId);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6">
        <h1 className="text-heading font-heading text-foreground mb-8">
          Update Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-body font-body text-foreground mb-2"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
              maxLength={100}
            />
            {errors.productName && (
              <p className="text-destructive mt-1 text-sm">
                {errors.productName}
              </p>
            )}
            <p className="text-accent text-sm mt-1">
              {productName.length}/100 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-body font-body text-foreground mb-2">
              Product Images *
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragActive ? "border-primary bg-primary/10" : "border-input"
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-2xl mb-2 text-accent" />
              <p className="text-accent">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-sm text-accent mt-1">
                PNG, JPG, JPEG (max 5MB each, up to 3 images)
              </p>
            </div>
            {errors.image && (
              <p className="text-destructive mt-1 text-sm">{errors.image}</p>
            )}

            {/* Hiển thị danh sách ảnh và placeholder nếu thiếu */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={img.preview || ""}
                    alt={`Preview ${index + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-72 object-cover rounded-md cursor-pointer"
                    onClick={() => setPreviewImage(img.preview!)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
              {[...Array(3 - images.length)].map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-2 border-dashed border-input rounded-md h-40 flex items-center justify-center"
                >
                  <FiImage className="text-2xl text-accent" />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-body font-body text-foreground mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent min-h-[150px]"
              placeholder="Enter product description (minimum 50 characters)"
            />
            {errors.description && (
              <p className="text-destructive mt-1 text-sm">
                {errors.description}
              </p>
            )}
            <p className="text-accent text-sm mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-body font-body text-foreground">
              Publish Product
            </span>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className="text-3xl text-primary"
              aria-label={isPublished ? "Unpublish product" : "Publish product"}
            >
              {isPublished ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Update Product
          </button>
        </form>

        {/* Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-2xl w-full">
              <Image
                src={previewImage}
                alt="Preview"
                width={800}
                height={500}
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-destructive rounded-full text-white"
              >
                <FiX />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUpdate;
