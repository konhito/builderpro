"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ExcelFieldMapping() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['required']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const requiredFields = [
    { field: 'SKU', description: 'Unique product identifier', examples: ['PROD001', 'ABC-123', 'ITEM-456'] },
    { field: 'Title', description: 'Product name', examples: ['iPhone 15 Pro', 'Nike Air Max', 'Samsung Galaxy S24'] },
  ];

  const basicFields = [
    { field: 'Description', description: 'Product description', examples: ['High-quality smartphone with advanced features'] },
    { field: 'Price', description: 'Selling price', examples: ['29.99', '129.99', '999.00'] },
    { field: 'Original Price', description: 'Original/MSRP price for discounts', examples: ['39.99', '149.99', '1199.00'] },
    { field: 'Category', description: 'Product category', examples: ['Electronics', 'Clothing', 'Home & Garden'] },
    { field: 'Image', description: 'Main product image URL', examples: ['https://example.com/image1.jpg'] },
    { field: 'Images', description: 'Multiple images (comma-separated)', examples: ['https://example.com/img1.jpg,https://example.com/img2.jpg'] },
  ];

  const inventoryFields = [
    { field: 'Stock Quantity', description: 'Available inventory', examples: ['100', '50', '0'] },
    { field: 'Min Order Quantity', description: 'Minimum order amount', examples: ['1', '5', '10'] },
    { field: 'Max Order Quantity', description: 'Maximum order amount', examples: ['100', '500', '1000'] },
    { field: 'Availability', description: 'Stock status', examples: ['in_stock', 'out_of_stock', 'pre_order'] },
  ];

  const physicalFields = [
    { field: 'Size', description: 'Product size', examples: ['Small', 'Medium', 'Large', 'XL'] },
    { field: 'Weight', description: 'Product weight in kg', examples: ['0.5', '1.2', '2.5'] },
    { field: 'Dimensions', description: 'Product dimensions (LxWxH)', examples: ['10x5x2', '30x20x15'] },
  ];

  const marketingFields = [
    { field: 'Is Active', description: 'Product visibility (true/false)', examples: ['true', 'false', '1', '0'] },
    { field: 'Is Featured', description: 'Featured product (true/false)', examples: ['true', 'false', '1', '0'] },
    { field: 'Tags', description: 'Product tags (comma-separated)', examples: ['electronics,smartphone,apple', 'clothing,summer,casual'] },
  ];

  const seoFields = [
    { field: 'SEO Title', description: 'SEO meta title', examples: ['Best iPhone 15 Pro - Buy Now'] },
    { field: 'SEO Description', description: 'SEO meta description', examples: ['Shop the latest iPhone 15 Pro with advanced features'] },
    { field: 'Keywords', description: 'SEO keywords (comma-separated)', examples: ['iphone,smartphone,apple,electronics'] },
  ];

  const specificationFields = [
    { field: 'Specifications', description: 'Product specs (JSON or key:value)', examples: ['{"Color":"Black","Storage":"256GB"}', 'Color:Black,Storage:256GB'] },
  ];

  const alternativeNames = {
    'Title': ['Product Name', 'Name'],
    'Price': ['Selling Price'],
    'Original Price': ['MSRP'],
    'Category': ['Product Category'],
    'Image': ['Main Image'],
    'Images': ['Product Images'],
    'Specifications': ['Specs'],
    'Availability': ['Stock Status'],
    'Is Active': ['Active'],
    'Is Featured': ['Featured'],
    'Stock Quantity': ['Inventory'],
    'Min Order Quantity': ['Min Order'],
    'Max Order Quantity': ['Max Order'],
    'Weight': ['Weight (kg)'],
    'Dimensions': ['Size (cm)'],
    'SEO Title': ['Meta Title'],
    'SEO Description': ['Meta Description'],
    'Keywords': ['Meta Keywords'],
  };

  const FieldSection = ({ title, fields, sectionKey }: { title: string; fields: any[]; sectionKey: string }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {expandedSections.has(sectionKey) ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {expandedSections.has(sectionKey) && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{field.field}</h4>
                    <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-medium">Examples:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {field.examples.map((example, i) => (
                          <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    {alternativeNames[field.field as keyof typeof alternativeNames] && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-medium">Alternative names:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alternativeNames[field.field as keyof typeof alternativeNames].map((alt, i) => (
                            <span key={i} className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Excel Field Mapping Guide</h2>
        <p className="text-sm text-gray-600">
          This guide shows all supported fields for Excel import. Use any of the field names or their alternatives as column headers.
        </p>
      </div>

      <div className="space-y-4">
        <FieldSection 
          title="Required Fields (Must be present)" 
          fields={requiredFields} 
          sectionKey="required" 
        />
        
        <FieldSection 
          title="Basic Product Information" 
          fields={basicFields} 
          sectionKey="basic" 
        />
        
        <FieldSection 
          title="Inventory Management" 
          fields={inventoryFields} 
          sectionKey="inventory" 
        />
        
        <FieldSection 
          title="Physical Attributes" 
          fields={physicalFields} 
          sectionKey="physical" 
        />
        
        <FieldSection 
          title="Marketing & Display" 
          fields={marketingFields} 
          sectionKey="marketing" 
        />
        
        <FieldSection 
          title="SEO & Search" 
          fields={seoFields} 
          sectionKey="seo" 
        />
        
        <FieldSection 
          title="Specifications" 
          fields={specificationFields} 
          sectionKey="specs" 
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Excel Import</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the first row for column headers</li>
          <li>• Field names are case-insensitive</li>
          <li>• Empty cells will be ignored (except for required fields)</li>
          <li>• Boolean values can be: true/false, 1/0, yes/no</li>
          <li>• Multiple values (images, tags) should be comma-separated</li>
          <li>• JSON specifications should be valid JSON format</li>
          <li>• URLs should be complete with http:// or https://</li>
        </ul>
      </div>
    </div>
  );
}
