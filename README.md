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
    git clone https://github.com/YOUR_USERNAME/IndiaCart-Ecommerce-Firebase-SPA.git
    cd IndiaCart-Ecommerce-Firebase-SPA
    ```

2.  **Firebase Project Setup:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new Firebase project.
    *   Add a web app to your project and copy your Firebase configuration.
    *   Enable the following Firebase services:
        *   **Authentication:** Enable "Email/Password" sign-in method.
        *   **Realtime Database:** Start in "test mode" or set up appropriate security rules.
        *   **Storage:** Set up security rules to allow read/write for authenticated users.

3.  **Update Firebase Configuration:**
    *   Open `index.html` and `admin.html`.
    *   Locate the `firebaseConfig` object in the `<script type="module">` section.
    *   Replace `YOUR_FIREBASE_API_KEY`, `YOUR_FIREBASE_AUTH_DOMAIN`, etc., with your actual Firebase project's configuration values. Ensure `databaseURL` is in the format `https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com`.

4.  **Seed Admin User (Important!):**
    *   After setting up Firebase and updating `admin.html`, create an admin user:
        1.  Open `admin.html` in your browser.
        2.  Log in using the email and password you intend for your admin. This user account will be created in Firebase Authentication.
        3.  Go to the Firebase Realtime Database in your Firebase Console.
        4.  Manually create a node named `admins`.
        5.  Inside `admins`, add a new child node with the `uid` (User ID) of the user you just logged in with, and set its value to `true`.
           *   Example:
               ```json
               {
                 "admins": {
                   "YOUR_ADMIN_UID": true
                 }
               }
               ```
        *   This step is crucial for the admin panel's access control. Only users with their UID explicitly listed under `admins` as `true` will be granted access.

5.  **PayPal Client ID (Customer App):**
    *   In `index.html`, locate the PayPal SDK script tag.
    *   Replace `YOUR_DUMMY_PAYPAL_CLIENT_ID_HERE` with your actual PayPal client ID if you intend to implement real payments. For demonstration, the dummy ID suffices, and the payment logic is simulated.

---

## Usage

### For Customers (`index.html`)

Open `index.html` directly in your browser or deploy it via GitHub Pages.

*   **Browse Products:** Navigate through categories, use the search bar, or explore carousels.
*   **Login/Signup:** Access your profile, cart, and wishlist.
*   **Add to Cart/Wishlist:** Click icons or buttons to manage products.
*   **Checkout:** Proceed from the cart to enter address details and simulate payment.
*   **Profile:** Manage your details, view orders, and for sellers, access the seller dashboard.

### For Administrators (`admin.html`)

Open `admin.html` directly in your browser.

*   **Login:** Use the Firebase account configured as an admin in your Firebase Realtime Database.
*   **Dashboard:** View key metrics.
*   **Manage Data:** Use the sidebar navigation to access sections for Products, Orders, Banners, Categories, Users, and Sellers. Perform CRUD operations as needed.

---

## Deployment to GitHub Pages

1.  **Create a New GitHub Repository:** Go to `github.com/new` and create a new public repository (e.g., `IndiaCart-Ecommerce-Firebase-SPA`).
2.  **Push Your Code:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit: IndiaCart E-commerce App"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/IndiaCart-Ecommerce-Firebase-SPA.git
    git push -u origin main
    ```
3.  **Enable GitHub Pages:**
    *   On your GitHub repository page, go to **Settings > Pages**.
    *   Under "Build and deployment", select "Deploy from a branch".
    *   For "Branch", choose `main` and `/ (root)` for the folder.
    *   Click "Save".
    *   GitHub Pages will build and deploy your site. The URL will typically be `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`. It might take a few minutes for the deployment to complete.

---

## Contributing

Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

---

## Contact

*   Your Name/Handle - [Your GitHub Profile](https://github.com/YOUR_USERNAME)
*   Project Link: `https://github.com/YOUR_USERNAME/IndiaCart-Ecommerce-Firebase-SPA`
*   Deployed Customer App: `https://YOUR_USERNAME.github.io/IndiaCart-Ecommerce-Firebase-SPA/index.html`
*   Deployed Admin Panel: `https://YOUR_USERNAME.github.io/IndiaCart-Ecommerce-Firebase-SPA/admin.html`