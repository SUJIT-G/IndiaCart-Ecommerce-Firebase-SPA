# IndiaCart: A Full-Stack E-commerce Web Application

![App Screenshot](https://picsum.photos/1200/600?text=IndiaCart+Ecommerce+App) <!-- Replace with an actual screenshot of your app -->

## Overview

IndiaCart is a comprehensive, mobile-first E-commerce Single-Page Application (SPA) designed to showcase modern web development practices with Firebase. It features a distinct customer-facing interface for browsing and purchasing, and a robust admin panel for managing the store's operations.

---

## Features

### Customer Application (`index.html`)

*   **Mobile-First & Responsive Design:** Optimized for seamless experience across all devices.
*   **Dynamic Screens:** Home, Search Results, Product Details, Cart, Profile, My Orders, Track Order, Delivery Address, Order Confirmation, and Wishlist.
*   **User Authentication:** Secure Login/Signup using Firebase Email/Password.
*   **Profile Management:** Update user name, upload profile picture (Firebase Storage).
*   **Product Browsing:**
    *   Home screen with banner slider, product categories, and product carousels.
    *   Search functionality with results page.
    *   Filtering by category and product type (physical/digital).
    *   Sorting products by price (Low to High, High to Low).
    *   Detailed product pages with images, descriptions, and purchase options.
*   **Wishlist (Favorites):** Save favorite products to a personalized wishlist.
*   **Shopping Cart:** Add, remove, and adjust quantities of products.
*   **Checkout Flow:**
    *   Delivery address management with Pincode auto-fill (using `api.postalpincode.in`).
    *   Support for Physical and Digital product checkout (conditionally hides address for digital).
    *   Payment method selection (Cash on Delivery, Online/PayPal - *dummy integration*).
*   **Order Tracking:** View past orders with a visual timeline of status updates.
*   **Seller Dashboard (Customer Panel):** Integrated mini-dashboard within the profile for users marked as sellers to add/manage their own products.
*   **Theming:** Utilizes CSS variables for easy customization, with a primary red theme.

### Admin Panel (`admin.html`)

*   **Secure Admin Login:** Separate authentication for administrators only.
*   **Dashboard:** Overview of key statistics: Today's Orders, Total Products, Total Earnings, Recent Orders.
*   **Orders Management:**
    *   View all orders with filtering by status.
    *   Detailed order view (customer info, address, items).
    *   Update order status (e.g., Placed, In Progress, Shipped, Delivered, Cancelled) with timestamps.
    *   Real-time notification badge for new 'placed' orders.
*   **Products Management:**
    *   CRUD (Create, Read, Update, Delete) operations for products.
    *   Filter products by category, type, and assigned seller.
    *   Assign products to specific sellers or 'Platform'.
*   **Banners Management:** Add and delete hero banner images.
*   **Categories Management:** Add and delete product categories (name & icon).
*   **Users Management:** List all registered users and their roles (Customer/Seller).
*   **Sellers Management:** View and manage registered sellers, including toggling their active status and editing public seller names.

---

## Technologies Used

*   **Frontend:** HTML5, CSS3 (Tailwind CSS for utility-first styling), JavaScript (ES6 Modules)
*   **Backend as a Service (BaaS):** Google Firebase (v9 Modular SDK)
    *   **Firebase Authentication:** Email/Password for user and admin login.
    *   **Firebase Realtime Database:** For storing products, categories, banners, user profiles, carts, wishlists, and orders.
    *   **Firebase Storage:** For user profile pictures.
*   **External APIs:** `api.postalpincode.in` for address auto-fill.
*   **Icons:** Font Awesome (via CDN)

---

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://sujit-g.github.io/IndiaCart-Ecommerce-Firebase-SPA/
    cd IndiaCart-Ecommerce-Firebase-SPA
    ```



*   **Browse Products:** Navigate through categories, use the search bar, or explore carousels.
*   **Login/Signup:** Access your profile, cart, and wishlist.
*   **Add to Cart/Wishlist:** Click icons or buttons to manage products.
*   **Checkout:** Proceed from the cart to enter address details and simulate payment.
*   **Profile:** Manage your details, view orders, and for sellers, access the seller dashboard.


## Contributing

Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

---

## Contact

*   Your Name/Handle - [Your GitHub Profile](#)
*   Project Link: `https://sujit-g.github.io/IndiaCart-Ecommerce-Firebase-SPA/`
*   Deployed Customer App: `  Project Link: `https://sujit-g.github.io/IndiaCart-Ecommerce-Firebase-SPA/index.html`
*  
*   Deployed Admin Panel: `  Project Link: `https://sujit-g.github.io/IndiaCart-Ecommerce-Firebase-SPA/admin.html`
