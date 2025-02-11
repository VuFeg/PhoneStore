"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { createProduct } from "@/services/productsService";
import { uploadImage } from "@/services/mediaService"; // Import the uploadImage function

const ProductCreation = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<Array<{ file: File; url: string }>>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState<{
    productName?: string;
    description?: string;
    images?: string;
  }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: {
      productName?: string;
      description?: string;
      images?: string;
    } = {};
    if (!productName) newErrors.productName = "Product name is required";
    if (productName.length > 100)
      newErrors.productName = "Product name cannot exceed 100 characters";
    if (description.length < 50)
      newErrors.description = "Description must be at least 50 characters";
    if (description.length > 500)
      newErrors.description = "Description cannot exceed 500 characters";
    if (images.length < 3) newErrors.images = "Please upload at least 3 images";
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
          file,
          url: response.url,
        };
        setImages((prev) => [...prev, newImage].slice(0, 3));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }, []);

  console.log("Images:", images);

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

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const image_urls = images.map((img) => img.url);

        const productData = {
          name: productName,
          description,
          image_urls, // Use the uploaded image URLs
          isPublished,
        };
        await createProduct(productData);
        // Reset form after successful creation
        setProductName("");
        setDescription("");
        setImages([]);
        setIsPublished(false);
        setErrors({});
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  useEffect(() => {
    return () => images.forEach((image) => URL.revokeObjectURL(image.url));
  }, [images]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6">
        <h1 className="text-heading font-heading text-foreground mb-8">
          Create Product
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
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
                ${
                  isDragActive ? "border-primary bg-primary/10" : "border-input"
                }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-2xl mb-2 text-accent" />
              <p className="text-accent">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-sm text-accent mt-1">
                PNG, JPG, JPEG (max 5MB each)
              </p>
            </div>
            {errors.images && (
              <p className="text-destructive mt-1 text-sm">{errors.images}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                    onClick={() => setPreviewImage(img.url)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
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

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Product
          </button>
        </form>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-2xl w-full">
              <img
                src={previewImage}
                alt="Preview"
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

export default ProductCreation;
