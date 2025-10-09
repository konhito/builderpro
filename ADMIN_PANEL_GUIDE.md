# 🛠️ Admin Panel Guide

Complete guide to the Timco Admin Panel for managing products, orders, and users.

## 🚀 Quick Start

### 1. Access the Admin Panel

Navigate to `/admin` in your browser. You'll be redirected to login if not authenticated.

### 2. Admin Authentication

The admin panel uses role-based access control:
- **User Role**: Regular customers (default)
- **Admin Role**: Can manage products and view orders
- **Super Admin Role**: Full access to all features

### 3. Setting Up Your First Admin

Run the setup script to create an admin user:

```bash
node scripts/setup-admin.js
```

Then register with the admin email (`admin@timco.com`) to set a password.

## 📊 Dashboard Overview

The admin dashboard provides key metrics and quick access to:

- **Total Products**: Count of all products in the catalog
- **Active Products**: Products currently available for sale
- **Total Orders**: Number of orders placed
- **Total Users**: Registered customer count
- **Recent Orders**: Latest 10 orders with status
- **Top Products**: Most ordered products

## 🛍️ Product Management

### Viewing Products

1. Navigate to **Products** in the sidebar
2. Use filters to search by:
   - Product name, SKU, or description
   - Category
   - Status (Active/Inactive)
3. Sort and paginate through results

### Adding New Products

1. Click **Add Product** button
2. Fill out the multi-tab form:

#### Basic Info Tab
- **SKU**: Unique product identifier (required)
- **Title**: Product name (required)
- **Description**: Detailed product description
- **Category**: Select from predefined categories
- **Size**: Product dimensions or size info
- **Quantity**: Package quantity information
- **Active**: Whether product is available for sale
- **Featured**: Highlight on homepage

#### Pricing & Inventory Tab
- **Price**: Current selling price
- **Original Price**: MSRP for discount display
- **Stock Quantity**: Available inventory
- **Min/Max Order Quantity**: Order limits
- **Availability**: Stock status
- **Weight**: Product weight in kg
- **Dimensions**: Length, width, height in cm

#### Media Tab
- **Main Image**: Primary product image URL
- **Additional Images**: Gallery images

#### Specifications Tab
- **Product Specs**: Key-value pairs for technical details
- **Tags**: Searchable product tags

#### SEO Tab
- **SEO Title**: Search engine title
- **SEO Description**: Meta description
- **Meta Keywords**: Search keywords

### Editing Products

1. Find the product in the products list
2. Click the **Edit** icon (pencil)
3. Modify any fields in the form
4. Save changes

### Bulk Operations

1. Select multiple products using checkboxes
2. Choose bulk actions:
   - **Delete Selected**: Remove multiple products
   - More actions can be added as needed

### Product Status Management

- **Active**: Product is visible and purchasable
- **Inactive**: Product is hidden from customers
- **Featured**: Highlighted on homepage and category pages

## 📦 Order Management

### Viewing Orders

1. Navigate to **Orders** in the sidebar
2. View order details including:
   - Order number and date
   - Customer information
   - Order status
   - Total amount
   - Items ordered

### Order Status Updates

Update order status through the order details page:
- **Pending**: New order awaiting processing
- **Processing**: Order being prepared
- **Shipped**: Order dispatched
- **Delivered**: Order completed
- **Cancelled**: Order cancelled

## 👥 Customer Management

### Viewing Customers

1. Navigate to **Customers** in the sidebar
2. View customer information:
   - Name and email
   - Registration date
   - Order history
   - Account status

### Customer Actions

- View detailed customer profile
- Access order history
- Manage account status

## 📈 Analytics

### Sales Analytics

- Revenue trends
- Top-selling products
- Customer acquisition metrics
- Order volume analysis

### Product Performance

- Product view counts
- Conversion rates
- Inventory turnover
- Low stock alerts

## ⚙️ Settings

### General Settings

- Site configuration
- Email settings
- Payment methods
- Shipping options

### User Management

- Admin user roles
- Permission settings
- Access controls

## 🔐 Security Features

### Role-Based Access

- **Super Admin**: Full system access
- **Admin**: Product and order management
- **User**: Customer access only

### Authentication

- Secure login with email/password
- Google OAuth integration
- Session management
- Password requirements

### Data Protection

- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens

## 🚨 Troubleshooting

### Common Issues

#### Can't Access Admin Panel
- Ensure you're logged in with an admin account
- Check your user role in the database
- Clear browser cache and cookies

#### Products Not Saving
- Verify all required fields are filled
- Check for duplicate SKUs
- Ensure proper data format

#### Images Not Displaying
- Verify image URLs are accessible
- Check image format (JPG, PNG, WebP)
- Ensure proper URL encoding

### Database Issues

#### Reset Admin User
```sql
UPDATE user SET role = 'super_admin' WHERE email = 'your-email@example.com';
```

#### Check User Roles
```sql
SELECT id, name, email, role FROM user WHERE role IN ('admin', 'super_admin');
```

## 📱 Mobile Responsiveness

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔄 Data Synchronization

### Product Data Sources

1. **Static JSON**: Initial product catalog from `assets/products.json`
2. **Database**: Admin-managed products
3. **Scraped Data**: Real-time data from TIMCO website

### Data Flow

```
Admin Edits → Database → Product Pages → Customer View
     ↓
Static JSON → Fallback Data → Product Pages
```

## 🎯 Best Practices

### Product Management

1. **Use Descriptive SKUs**: Make them searchable and memorable
2. **High-Quality Images**: Use clear, well-lit product photos
3. **Complete Descriptions**: Include all relevant details
4. **Proper Categorization**: Use consistent category names
5. **Regular Updates**: Keep pricing and inventory current

### Order Management

1. **Quick Status Updates**: Process orders promptly
2. **Clear Communication**: Update customers on order status
3. **Inventory Tracking**: Monitor stock levels
4. **Customer Service**: Address issues quickly

### Security

1. **Strong Passwords**: Use complex, unique passwords
2. **Regular Updates**: Keep admin accounts secure
3. **Access Monitoring**: Review admin activity
4. **Data Backups**: Regular database backups

## 🚀 Advanced Features

### Bulk Import

Import products from CSV files (future feature):
- Product data validation
- Duplicate detection
- Error reporting
- Progress tracking

### Automated Tasks

- Low stock alerts
- Price change notifications
- Order status updates
- Customer communication

### Integration

- Email marketing platforms
- Inventory management systems
- Payment processors
- Shipping providers

## 📞 Support

For technical support or questions:

1. Check this documentation
2. Review error logs
3. Contact development team
4. Submit issue reports

## 🔄 Updates

The admin panel is regularly updated with:
- New features
- Security improvements
- Performance optimizations
- Bug fixes

Check the changelog for latest updates and new features.

---

**Happy Administering!** 🎉

The Timco Admin Panel gives you complete control over your e-commerce store. Use it wisely and efficiently to manage your product catalog and serve your customers better.
