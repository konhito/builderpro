"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

interface ProductFormData {
  sku: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  size: string;
  quantity: string;
  category: string;
  image: string;
  images: string[];
  specifications: Record<string, string>;
  availability: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: string;
  minOrderQuantity: string;
  maxOrderQuantity: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string;
}

const initialFormData: ProductFormData = {
  sku: "",
  title: "",
  description: "",
  price: "",
  originalPrice: "",
  size: "",
  quantity: "",
  category: "",
  image: "",
  images: [],
  specifications: {},
  availability: "in_stock",
  isActive: true,
  isFeatured: false,
  stockQuantity: "0",
  minOrderQuantity: "1",
  maxOrderQuantity: "",
  weight: "",
  dimensions: {
    length: "",
    width: "",
    height: "",
  },
  tags: [],
  seoTitle: "",
  seoDescription: "",
  metaKeywords: "",
};

const categories = [
  "Screws",
  "Fasteners & Fixings",
  "Nails",
  "Adhesives & Building Chemicals",
  "Powertool Accessories",
  "Hand Tools",
  "Painting & Decorating",
  "Building Hardware & Supplies",
  "Security & Ironmongery",
  "Workwear, PPE & Safety",
];

const availabilityOptions = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "discontinued", label: "Discontinued" },
  { value: "coming_soon", label: "Coming Soon" },
];

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
  productId?: string;
}

export default function ProductForm({ initialData, isEdit = false, productId }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>(
    initialData ? {
      sku: initialData.sku || "",
      title: initialData.title || "",
      description: initialData.description || "",
      price: initialData.price || "",
      originalPrice: initialData.originalPrice || "",
      size: initialData.size || "",
      quantity: initialData.quantity || "",
      category: initialData.category || "",
      image: initialData.image || "",
      images: initialData.images || [],
      specifications: initialData.specifications || {},
      availability: initialData.availability || "in_stock",
      isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      isFeatured: initialData.isFeatured || false,
      stockQuantity: initialData.stockQuantity?.toString() || "0",
      minOrderQuantity: initialData.minOrderQuantity?.toString() || "1",
      maxOrderQuantity: initialData.maxOrderQuantity?.toString() || "",
      weight: initialData.weight || "",
      dimensions: initialData.dimensions || { length: "", width: "", height: "" },
      tags: initialData.tags || [],
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      metaKeywords: initialData.metaKeywords || "",
    } : initialFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const addSpecification = () => {
    const key = prompt("Enter specification name:");
    if (key) {
      handleSpecificationChange(key, "");
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    const tag = prompt("Enter tag:");
    if (tag) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: isEdit ? "Product updated successfully!" : "Product created successfully!",
          type: "success",
        });
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || `Failed to ${isEdit ? 'update' : 'create'} product`,
          type: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} product`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", name: "Basic Info" },
    { id: "pricing", name: "Pricing & Inventory" },
    { id: "media", name: "Media" },
    { id: "specifications", name: "Specifications" },
    { id: "seo", name: "SEO" },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    required
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Featured
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Inventory Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                    Original Price (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    id="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="minOrderQuantity" className="block text-sm font-medium text-gray-700">
                    Min Order Quantity
                  </label>
                  <input
                    type="number"
                    name="minOrderQuantity"
                    id="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="maxOrderQuantity" className="block text-sm font-medium text-gray-700">
                    Max Order Quantity
                  </label>
                  <input
                    type="number"
                    name="maxOrderQuantity"
                    id="maxOrderQuantity"
                    value={formData.maxOrderQuantity}
                    onChange={(e) => handleInputChange("maxOrderQuantity", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  name="availability"
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="weight"
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dimensions (cm)
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Length"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange("dimensions", { ...formData.dimensions, length: e.target.value })}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Width"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange("dimensions", { ...formData.dimensions, width: e.target.value })}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Height"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange("dimensions", { ...formData.dimensions, height: e.target.value })}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Main Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <button
                    type="button"
                    onClick={addImage}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Image
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          handleInputChange("images", newImages);
                        }}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Product Specifications
                </label>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newSpecs = { ...formData.specifications };
                        delete newSpecs[key];
                        newSpecs[e.target.value] = value;
                        handleInputChange("specifications", newSpecs);
                      }}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <span className="text-gray-500">:</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  id="seoDescription"
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Product" : "Create Product")}
          </button>
        </div>
      </form>
    </div>
  );
}
