import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    onValue,
    set,
    push,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkefZxw5CyZBSvXDI0IK5d8uqQphJA3Ho",
  authDomain: "indiacart-e-commerce-app.firebaseapp.com",
  databaseURL: "https://indiacart-e-commerce-app-default-rtdb.firebaseio.com",
  projectId: "indiacart-e-commerce-app",
  storageBucket: "indiacart-e-commerce-app.firebasestorage.app",
  messagingSenderId: "557161274487",
  appId: "1:557161274487:web:bafaa15e6fb8ba5484ba72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

let currentUser = null;
let allProductsData = []; // Store all products fetched from Firebase
let currentFilterCategory = null;
let currentSortOrder = 'lowToHigh';
let currentSearchQuery = '';

// Global state for cart and wishlist (will be synchronized with Firebase)
let userCart = [];
let userWishlist = [];
let userAddress = null; // Stored user address
let userOrders = []; // Stored user orders

// --- UI ELEMENTS ---
// Fix for multiple errors: Cast DOM elements to their correct types
const loginModal = document.getElementById('login-modal') as HTMLElement;
const loginBtn = document.getElementById('login-btn') as HTMLElement;
const userProfileMenuContainer = document.getElementById('user-profile-menu-container') as HTMLElement;
const userProfileToggle = document.getElementById('user-profile-toggle') as HTMLElement;
const profileDropdown = document.getElementById('profile-dropdown') as HTMLElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLElement;
const profileLogoutBtn = document.getElementById('profile-logout-btn') as HTMLElement;
const authForm = document.getElementById('auth-form') as HTMLFormElement;
const switchAuthModeLink = document.getElementById('switch-auth-mode') as HTMLElement;
const mainAuthBtn = document.getElementById('main-auth-btn') as HTMLElement;
const modalTitle = document.getElementById('modal-title') as HTMLElement;
const modalSubtitle = document.getElementById('modal-subtitle') as HTMLElement;
const authErrorDiv = document.getElementById('auth-error') as HTMLElement;
const emailInput = document.getElementById('email-input') as HTMLInputElement;
const passwordInput = document.getElementById('password-input') as HTMLInputElement;

const cartCountSpan = document.getElementById('cart-count') as HTMLElement;
const wishlistCountSpan = document.getElementById('wishlist-count') as HTMLElement;
const heroSlider = document.getElementById('hero-slider') as HTMLElement;
const sliderDotsContainer = document.getElementById('slider-dots') as HTMLElement;
const categoryGrid = document.getElementById('category-grid') as HTMLElement;
const productCarouselsDiv = document.getElementById('product-carousels') as HTMLElement;
const desktopSearchInput = document.getElementById('desktop-search-input') as HTMLInputElement;
const mobileSearchInput = document.getElementById('mobile-search-input') as HTMLInputElement;
const desktopSearchBtn = document.getElementById('desktop-search-btn') as HTMLElement;
const mobileSearchBtn = document.getElementById('mobile-search-btn') as HTMLElement;

const searchResultsPage = document.getElementById('search-results-page') as HTMLElement;
const searchProductGrid = document.getElementById('search-product-grid') as HTMLElement;
const searchQueryDisplay = document.getElementById('search-query-display') as HTMLElement;
const totalResultsSpan = document.getElementById('total-results') as HTMLElement;

const listingPage = document.getElementById('listing-page') as HTMLElement;
const productGrid = document.getElementById('product-grid') as HTMLElement;
const listingTitle = document.getElementById('listing-title') as HTMLElement;
const listingTotalResultsSpan = document.getElementById('listing-total-results') as HTMLElement;

const detailsPage = document.getElementById('details-page') as HTMLElement;
const productDetailContent = document.getElementById('product-detail-content') as HTMLElement;

const cartPage = document.getElementById('cart-page') as HTMLElement;
const cartItemsContainer = document.getElementById('cart-items-container') as HTMLElement;
const cartSummary = document.getElementById('cart-summary') as HTMLElement;

const favoritesPage = document.getElementById('favorites-page') as HTMLElement;
const favoritesContainer = document.getElementById('favorites-container') as HTMLElement;
const favoritesEmptyMessage = document.getElementById('favorites-empty-message') as HTMLElement;

const profilePage = document.getElementById('profile-page') as HTMLElement;
const profilePicDisplay = document.getElementById('profile-pic-display') as HTMLImageElement;
const profilePicUpload = document.getElementById('profile-pic-upload') as HTMLInputElement;
const profileNameInput = document.getElementById('profile-name-input') as HTMLInputElement;
const profileUserEmailSpan = document.getElementById('profile-user-email') as HTMLElement;
const updateProfileBtn = document.getElementById('update-profile-btn') as HTMLElement;
const headerProfilePic = document.getElementById('header-profile-pic') as HTMLImageElement;
const headerUserName = document.getElementById('header-user-name') as HTMLElement;

const myOrdersPage = document.getElementById('my-orders-page') as HTMLElement;
const ordersContainer = document.getElementById('orders-container') as HTMLElement;
const ordersEmptyMessage = document.getElementById('orders-empty-message') as HTMLElement;

const trackOrderPage = document.getElementById('track-order-page') as HTMLElement;
const trackOrderIdSpan = document.getElementById('track-order-id') as HTMLElement;
const orderTimeline = document.getElementById('order-timeline') as HTMLElement;
const trackOrderNotFound = document.getElementById('track-order-not-found') as HTMLElement;

const deliveryAddressPage = document.getElementById('delivery-address-page') as HTMLElement;
const addressForm = document.getElementById('address-form') as HTMLFormElement;
const pincodeInput = document.getElementById('pincode') as HTMLInputElement;
const cityInput = document.getElementById('city') as HTMLInputElement;
const stateInput = document.getElementById('state') as HTMLInputElement;
const fullNameInput = document.getElementById('full-name') as HTMLInputElement;
const mobileNumberInput = document.getElementById('mobile-number') as HTMLInputElement;
const addressLine1Input = document.getElementById('address-line1') as HTMLInputElement;
const addressLine2Input = document.getElementById('address-line2') as HTMLInputElement;
const placeOrderBtn = document.getElementById('place-order-btn') as HTMLElement;

const orderConfirmationPage = document.getElementById('order-confirmation-page') as HTMLElement;
const confirmedOrderIdSpan = document.getElementById('confirmed-order-id') as HTMLElement;

const alertModal = document.getElementById('alert-modal') as HTMLElement;
const alertModalTitle = document.getElementById('alert-modal-title') as HTMLElement;
const alertModalMessage = document.getElementById('alert-modal-message') as HTMLElement;

const filterSortModal = document.getElementById('filter-sort-modal') as HTMLElement;
const filterCategoriesContainer = document.getElementById('filter-categories-container') as HTMLElement;
const applyFilterSortBtn = document.getElementById('apply-filter-sort-btn') as HTMLElement;

// --- GLOBAL FUNCTIONS & HELPERS ---
function showPage(pageId, productId = null, orderId = null) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    window.scrollTo(0, 0);

    if (pageId === 'details' && productId) {
        renderProductDetails(productId);
    } else if (pageId === 'cart') {
        renderCart();
    } else if (pageId === 'favorites') {
        renderFavorites();
    } else if (pageId === 'profile') {
        renderProfilePage();
    } else if (pageId === 'my-orders') {
        renderMyOrders();
    } else if (pageId === 'track-order' && orderId) {
        renderTrackOrder(orderId);
    } else if (pageId === 'search-results') {
        renderSearchResults(currentSearchQuery, true); // Re-render with current query
    } else if (pageId === 'listing') {
        renderProductListing(currentFilterCategory, currentSortOrder, true); // Re-render with current filters
    }
}

function showAlert(message, title = 'Alert') {
    alertModalTitle.textContent = title;
    alertModalMessage.textContent = message;
    alertModal.classList.add('flex');
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        showAlert(`Failed to fetch data from ${url}. Please try again later.`);
        return null;
    }
}

// --- PRODUCT RENDERING ---
function renderProductCard(product, isFavorite = false) {
    const priceNum = parseFloat(product.price.replace(/,/g, ''));
    return `
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 product-card cursor-pointer" data-product-id="${product.id}">
            <img src="${product.image || `https://picsum.photos/200/200?random=${product.id}`}" alt="${product.name}" class="w-full h-40 object-contain mb-4">
            <div>
                <h3 class="font-semibold text-sm truncate">${product.name}</h3>
                <div class="flex items-center my-2">
                    <div class="bg-green-600 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        ${product.rating || 'N/A'} <i class="fas fa-star text-xs ml-1"></i>
                    </div>
                    <button class="favorite-toggle ml-auto text-gray-400 hover:text-red-500 transition ${isFavorite ? 'text-red-500' : ''}" data-product-id="${product.id}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart text-lg"></i>
                    </button>
                </div>
                <p class="font-bold text-lg">₹${priceNum.toLocaleString('en-IN')}</p>
                <button class="w-full mt-2 bg-accent text-gray-900 font-bold py-2 rounded-md hover:bg-accent-dark transition add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

function renderProductCarousel(title, products) {
    const productsHTML = products.map(p => renderProductCard(p, userWishlist.includes(p.id))).join('');
    return `
        <section class="mb-8 bg-white p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4">${title}</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                ${productsHTML}
            </div>
        </section>
    `;
}

async function renderCategories() {
    onValue(ref(database, 'categories'), (snapshot) => {
        const categories = snapshot.val() || {};
        // Fix for errors on lines 229, 230, 231, 238: Property 'name'/'icon' does not exist on type 'unknown'.
        // Added an explicit type for the categories array.
        const categoriesArray: { name: string, icon: string }[] = Object.values(categories);
        categoryGrid.innerHTML = categoriesArray.map(cat => `
            <div class="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer nav-link category-link" data-category="${cat.name}">
                <i class="fas ${cat.icon} text-3xl text-primary mb-2"></i>
                <span class="text-sm font-semibold">${cat.name}</span>
            </div>
        `).join('');

        // Render categories in filter modal
        filterCategoriesContainer.innerHTML = categoriesArray.map(cat => `
            <label class="flex items-center">
                <input type="checkbox" name="filter-category" value="${cat.name}" class="mr-2 text-primary"> ${cat.name}
            </label>
        `).join('');
    });
}

function getFilteredAndSortedProducts(products, category = null, sortOrder = 'lowToHigh', searchQuery = '') {
    let filteredProducts = [...products];

    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (sortOrder === 'lowToHigh') {
        filteredProducts.sort((a, b) => parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')));
    } else if (sortOrder === 'highToLow') {
        filteredProducts.sort((a, b) => parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, '')));
    }
    return filteredProducts;
}

function renderProductListing(category = null, sortOrder = 'lowToHigh', fromNav = false) {
    currentFilterCategory = category;
    currentSortOrder = sortOrder;

    const productsToRender = getFilteredAndSortedProducts(allProductsData, category, sortOrder);
    productGrid.innerHTML = productsToRender.map(p => renderProductCard(p, userWishlist.includes(p.id))).join('');
    listingTitle.textContent = category ? category : "All Products";
    listingTotalResultsSpan.textContent = `${productsToRender.length} results found`;
    if (fromNav) showPage('listing');
}

function renderSearchResults(query, fromNav = false) {
    currentSearchQuery = query;
    const productsToRender = getFilteredAndSortedProducts(allProductsData, null, currentSortOrder, query);
    searchProductGrid.innerHTML = productsToRender.map(p => renderProductCard(p, userWishlist.includes(p.id))).join('');
    searchQueryDisplay.textContent = query;
    totalResultsSpan.textContent = `${productsToRender.length} results found`;
    if (fromNav) showPage('search-results');
}

function renderProductDetails(productId) {
    const product = allProductsData.find(p => p.id == productId);
    if (!product) {
        showAlert('Product not found.', 'Error');
        return;
    }
    const priceNum = parseFloat(product.price.replace(/,/g, ''));

    productDetailContent.innerHTML = `
        <div class="w-full lg:w-2/5">
            <img src="${product.image || `https://picsum.photos/400/400?random=${product.id}`}" alt="${product.name}" class="w-full rounded-lg shadow-md object-contain aspect-square">
        </div>
        <div class="w-full lg:w-3/5">
            <h2 class="text-3xl font-bold">${product.name}</h2>
            <div class="flex items-center my-3">
                <div class="bg-green-600 text-white text-sm px-3 py-1 rounded-md flex items-center">
                    ${product.rating || 'N/A'} <i class="fas fa-star text-xs ml-1"></i>
                </div>
                <span class="text-gray-600 ml-4">${product.reviews || 'No'} Ratings & ${product.numReviews || 'No'} Reviews</span>
            </div>
            <p class="text-3xl font-bold text-green-600 my-4">₹${priceNum.toLocaleString('en-IN')}</p>
            <p class="text-gray-700 mb-6">${product.description || 'A short but engaging description of the product goes here. Highlighting key features and benefits for the customer.'}</p>
            <div class="flex space-x-4">
                <button class="flex-1 bg-accent text-gray-900 font-bold py-3 rounded-md hover:bg-accent-dark transition add-to-cart-btn" data-product-id="${product.id}"><i class="fas fa-shopping-cart mr-2"></i>ADD TO CART</button>
                <button class="flex-1 bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark transition buy-now-btn" data-product-id="${product.id}"><i class="fas fa-bolt mr-2"></i>BUY NOW</button>
            </div>
            <div class="mt-8 border-t pt-4">
                <h3 class="font-bold text-lg mb-2">Specifications</h3>
                <ul class="list-disc list-inside text-gray-600">
                    <li>Brand: ${product.brand || 'N/A'}</li>
                    <li>Model: ${product.model || 'N/A'}</li>
                    <li>Weight: ${product.weight || 'N/A'}</li>
                    <li>Color: ${product.color || 'N/A'}</li>
                </ul>
            </div>
        </div>
    `;
}

// --- CART FUNCTIONALITY ---
async function updateCartInFirebase(cartItems) {
    if (currentUser) {
        await set(ref(database, `carts/${currentUser.uid}`), cartItems);
    }
}

function renderCart() {
    if (!currentUser) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Please log in to view your cart.</p>';
        cartSummary.innerHTML = '';
        cartCountSpan.textContent = '0';
        return;
    }

    if (userCart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
        cartSummary.innerHTML = '';
        cartCountSpan.textContent = '0';
        return;
    }

    cartItemsContainer.innerHTML = userCart.map(item => {
        const product = allProductsData.find(p => p.id === item.productId);
        if (!product) return ''; // Should not happen with good data
        const priceNum = parseFloat(product.price.replace(/,/g, ''));
        return `
            <div class="flex items-center justify-between border-b py-4">
                <div class="flex items-center">
                    <img src="${product.image || `https://picsum.photos/80/80?random=${product.id}`}" class="w-20 h-20 object-contain mr-4 rounded-md">
                    <div>
                        <h4 class="font-semibold">${product.name}</h4>
                        <p class="text-gray-500">₹${priceNum.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="cart-quantity-btn text-gray-600 hover:text-primary transition" data-action="decrement" data-product-id="${product.id}"><i class="fas fa-minus-circle"></i></button>
                    <span class="w-10 text-center mx-2">${item.quantity}</span>
                    <button class="cart-quantity-btn text-gray-600 hover:text-primary transition" data-action="increment" data-product-id="${product.id}"><i class="fas fa-plus-circle"></i></button>
                    <button class="text-red-500 hover:text-red-700 remove-from-cart-btn ml-4" data-product-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
                <p class="font-bold">₹${(priceNum * item.quantity).toLocaleString('en-IN')}</p>
            </div>
        `;
    }).join('');

    const total = userCart.reduce((acc, item) => {
        const product = allProductsData.find(p => p.id === item.productId);
        if (!product) return acc;
        const priceNum = parseFloat(product.price.replace(/,/g, ''));
        return acc + (priceNum * item.quantity);
    }, 0);

    cartSummary.innerHTML = `
        <p class="text-lg">Total: <span class="font-bold">₹${total.toLocaleString('en-IN')}</span></p>
        <button class="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-dark transition nav-link" data-page="delivery-address">Proceed to Checkout</button>
    `;
    cartCountSpan.textContent = userCart.length.toString();
}

// --- WISHLIST FUNCTIONALITY ---
async function updateWishlistInFirebase(wishlistItems) {
    if (currentUser) {
        await set(ref(database, `favorites/${currentUser.uid}`), wishlistItems);
    }
}

function renderFavorites() {
    if (!currentUser) {
        favoritesContainer.innerHTML = '';
        favoritesEmptyMessage.textContent = 'Please log in to view your wishlist.';
        favoritesEmptyMessage.classList.remove('hidden');
        wishlistCountSpan.textContent = '0';
        return;
    }

    if (userWishlist.length === 0) {
        favoritesContainer.innerHTML = '';
        favoritesEmptyMessage.textContent = 'Your wishlist is empty.';
        favoritesEmptyMessage.classList.remove('hidden');
        wishlistCountSpan.textContent = '0';
        return;
    }
    favoritesEmptyMessage.classList.add('hidden');

    const favoritedProducts = allProductsData.filter(p => userWishlist.includes(p.id));
    favoritesContainer.innerHTML = favoritedProducts.map(p => renderProductCard(p, true)).join('');
    wishlistCountSpan.textContent = userWishlist.length.toString();
}

// --- AUTHENTICATION ---
let isLoginMode = true; // true for login, false for signup

function showAuthError(message) {
    authErrorDiv.textContent = message;
    authErrorDiv.classList.remove('hidden');
}

function clearAuthError() {
     authErrorDiv.classList.add('hidden');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    clearAuthError();
    modalTitle.textContent = isLoginMode ? 'Login' : 'Looks like you\'re new here!';
    modalSubtitle.textContent = isLoginMode ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your email to get started';
    mainAuthBtn.textContent = isLoginMode ? 'Login' : 'Sign Up';
    switchAuthModeLink.innerHTML = isLoginMode ? 'New to IndiCart? <span class="font-semibold">Create an account</span>' : 'Existing User? <span class="font-semibold">Log in</span>';
}

loginBtn.addEventListener('click', () => {
    loginModal.classList.add('flex');
    toggleAuthMode(); // Ensure it starts in Login mode
    isLoginMode = true; // Explicitly set to login mode
    modalTitle.textContent = 'Login';
    modalSubtitle.textContent = 'Get access to your Orders, Wishlist and Recommendations';
    mainAuthBtn.textContent = 'Login';
    switchAuthModeLink.innerHTML = 'New to IndiCart? <span class="font-semibold">Create an account</span>';
    clearAuthError();
    emailInput.value = '';
    passwordInput.value = '';
});
document.querySelector('#login-modal .modal-close-btn').addEventListener('click', () => loginModal.classList.remove('flex'));
switchAuthModeLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthMode();
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Fix for errors on lines 456, 457: Property 'value' does not exist on type 'HTMLElement'.
    // Casting at declaration of emailInput and passwordInput fixes this.
    const email = emailInput.value;
    const password = passwordInput.value;
    clearAuthError();

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            // Optionally, save user profile to database upon signup
            await set(ref(database, `users/${auth.currentUser.uid}/profile`), {
                email: auth.currentUser.email,
                name: email.split('@')[0], // Default name
                profilePic: 'https://picsum.photos/120/120'
            });
        }
        loginModal.classList.remove('flex');
    } catch (error) {
        showAuthError(error.message);
    }
});

const handleLogout = () => {
    signOut(auth);
    showAlert('You have been logged out.');
    showPage('home');
};
logoutBtn.addEventListener('click', handleLogout);
profileLogoutBtn.addEventListener('click', handleLogout);

onAuthStateChanged(auth, async (user) => {
    currentUser = user; // Update global currentUser variable
    if (user) {
        // User is signed in
        loginBtn.classList.add('hidden');
        userProfileMenuContainer.classList.remove('hidden');
        userProfileMenuContainer.classList.add('flex'); // Show dropdown toggle

        // Fetch user profile
        onValue(ref(database, `users/${user.uid}/profile`), (snapshot) => {
            const profile = snapshot.val();
            if (profile) {
                // Fix for errors on lines 498, 499, 500, 504, 505, 506: Property 'src'/'value' does not exist on type 'HTMLElement'.
                // Casting elements at declaration fixes this.
                profilePicDisplay.src = profile.profilePic || 'https://picsum.photos/120/120';
                headerProfilePic.src = profile.profilePic || 'https://picsum.photos/40/40';
                profileNameInput.value = profile.name || '';
                headerUserName.textContent = profile.name || user.email.split('@')[0];
            } else {
                // Default values if no profile in DB
                profilePicDisplay.src = 'https://picsum.photos/120/120';
                headerProfilePic.src = 'https://picsum.photos/40/40';
                profileNameInput.value = '';
                headerUserName.textContent = user.email.split('@')[0];
            }
            profileUserEmailSpan.textContent = user.email;
        });

        // Listen to cart changes
        onValue(ref(database, `carts/${user.uid}`), (snapshot) => {
            userCart = snapshot.val() ? Object.values(snapshot.val()) : [];
            renderCart(); // Update cart UI when data changes
        });

        // Listen to wishlist changes
        onValue(ref(database, `favorites/${user.uid}`), (snapshot) => {
            // Fix for error on line 520: Property 'productId' does not exist on type 'unknown'.
            // Added type for wishlist item.
            userWishlist = snapshot.val() ? Object.values(snapshot.val()).map((item: { productId: any }) => item.productId) : [];
            renderFavorites(); // Update wishlist UI
            // Also update heart icons on current product listings
            // Fix for error on line 524: Property 'dataset' does not exist on type 'Element'.
            // Used querySelectorAll<HTMLElement> to get strongly typed elements.
            document.querySelectorAll<HTMLElement>('.product-card').forEach(card => {
                const productId = card.dataset.productId;
                const heartIcon = card.querySelector('.favorite-toggle i');
                if (heartIcon) {
                    if (userWishlist.includes(parseInt(productId))) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        heartIcon.parentElement.classList.add('text-red-500');
                    } else {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        heartIcon.parentElement.classList.remove('text-red-500');
                    }
                }
            });
        });

        // Listen to address changes
        onValue(ref(database, `users/${user.uid}/address`), (snapshot) => {
            userAddress = snapshot.val();
            if (userAddress) {
                // Fix for errors on lines 544-550: Property 'value' does not exist on type 'HTMLElement'.
                // Casting elements at declaration fixes this.
                fullNameInput.value = userAddress.fullName || '';
                mobileNumberInput.value = userAddress.mobileNumber || '';
                pincodeInput.value = userAddress.pincode || '';
                cityInput.value = userAddress.city || '';
                stateInput.value = userAddress.state || '';
                addressLine1Input.value = userAddress.addressLine1 || '';
                addressLine2Input.value = userAddress.addressLine2 || '';
            }
        });

        // Listen to orders changes
        onValue(ref(database, `orders/${user.uid}`), (snapshot) => {
            const ordersObject = snapshot.val();
            userOrders = ordersObject ? Object.values(ordersObject) : [];
            renderMyOrders();
        });

    } else {
        // User is signed out
        loginBtn.classList.remove('hidden');
        userProfileMenuContainer.classList.add('hidden');
        userProfileMenuContainer.classList.remove('flex');
        // Fix for errors on lines 566, 568, 569: Property 'src'/'value' does not exist on type 'HTMLElement'.
        // Casting elements at declaration fixes this.
        headerProfilePic.src = 'https://picsum.photos/40/40'; // Reset to default
        headerUserName.textContent = ''; // Clear user name
        profilePicDisplay.src = 'https://picsum.photos/120/120'; // Reset profile page pic
        profileNameInput.value = '';
        profileUserEmailSpan.textContent = '';

        // Clear local cart/wishlist
        userCart = [];
        userWishlist = [];
        userAddress = null;
        userOrders = [];

        renderCart();
        renderFavorites();
        renderMyOrders();
    }
});

// Toggle profile dropdown
userProfileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('hidden');
});
document.addEventListener('click', (e) => {
    // Fix for error on line 590: Argument of type 'EventTarget' is not assignable to parameter of type 'Node'.
    // Added a type check for e.target.
    if (e.target instanceof Node && !userProfileMenuContainer.contains(e.target)) {
        profileDropdown.classList.add('hidden');
    }
});

// --- INITIAL DATA LOADING ---
async function loadInitialData() {
    // Load Banners
    onValue(ref(database, 'banners'), (snapshot) => {
        const banners = snapshot.val() || [];
        if (banners.length > 0) {
            heroSlider.innerHTML = banners.map((banner, index) =>
                `<img src="${banner.image}" class="w-full flex-shrink-0 object-cover" alt="Banner ${index + 1}">`
            ).join('');
            updateSliderDots(banners.length); // Create dots after banners load
        }
    }, { onlyOnce: true });

    // Load Products
    onValue(ref(database, 'products'), (snapshot) => {
        const products = snapshot.val() || {};
        allProductsData = Object.keys(products).map(key => ({ id: key, ...products[key] }));

        const productCarouselHTML = {};
        // Group products by category or create general carousels
        const categoriesFromProducts = [...new Set(allProductsData.map(p => p.category))];
        categoriesFromProducts.forEach(cat => {
            const productsInCategory = allProductsData.filter(p => p.category === cat);
            productCarouselHTML[cat] = renderProductCarousel(cat, productsInCategory);
        });
         // Example: Also add "Top Deals" or "Featured" if you have a flag in product data
         productCarouselsDiv.innerHTML = Object.values(productCarouselHTML).join('');
    }, { onlyOnce: true });

    renderCategories(); // Categories will always render based on DB
}

// --- HOME PAGE SLIDER ---
let currentIndex = 0;
let sliderInterval;

function updateSlider() {
    const slides = heroSlider.children;
    if (slides.length === 0) return;
    heroSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateActiveDot();
}

function updateSliderDots(numSlides) {
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < numSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('w-2', 'h-2', 'rounded-full', 'bg-white/50', 'cursor-pointer');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetSliderInterval();
        });
        sliderDotsContainer.appendChild(dot);
    }
    updateActiveDot();
}

function updateActiveDot() {
    const dots = sliderDotsContainer.children;
    Array.from(dots).forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('bg-white');
            dot.classList.remove('bg-white/50');
        } else {
            dot.classList.add('bg-white/50');
            dot.classList.remove('bg-white');
        }
    });
}

function startSliderInterval() {
    sliderInterval = setInterval(() => {
        const slides = heroSlider.children;
        if (slides.length === 0) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }, 5000);
}

function resetSliderInterval() {
    clearInterval(sliderInterval);
    startSliderInterval();
}

document.getElementById('next-slide').addEventListener('click', () => {
    const slides = heroSlider.children;
    if (slides.length === 0) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
    resetSliderInterval();
});
document.getElementById('prev-slide').addEventListener('click', () => {
    const slides = heroSlider.children;
    if (slides.length === 0) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
    resetSliderInterval();
});
startSliderInterval(); // Start on page load


// Countdown Timer
const countdown = document.getElementById('countdown-timer');
let timeLeft = 2 * 60 * 60; // 2 hours
setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) timeLeft = 0; // Prevent negative time
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

// --- EVENT LISTENERS ---
document.body.addEventListener('click', async (e) => {
    // Fix for errors on lines 711, 727, 744, 762, 769, 785, 786, 791: Property 'closest' does not exist on type 'EventTarget'.
    // Cast e.target to Element to use 'closest'.
    const navLink = (e.target as Element).closest('.nav-link');
    if (navLink) {
        e.preventDefault();
        const pageId = (navLink as HTMLElement).dataset.page;
        if (pageId) {
            if (navLink.classList.contains('category-link')) {
                renderProductListing((navLink as HTMLElement).dataset.category, currentSortOrder, true);
            } else if (pageId === 'home') {
                showPage('home');
                resetSliderInterval(); // Ensure slider restarts correctly
            } else {
                showPage(pageId);
            }
        }
    }

    const addToCartBtn = (e.target as Element).closest('.add-to-cart-btn');
    if (addToCartBtn) {
        if (!currentUser) {
            showAlert('Please log in to add items to cart.', 'Login Required');
            return;
        }
        const productId = parseInt((addToCartBtn as HTMLElement).dataset.productId);
        const existingItem = userCart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            userCart.push({ productId, quantity: 1 });
        }
        await updateCartInFirebase(userCart);
        showAlert('Product added to cart!', 'Success');
    }

    const buyNowBtn = (e.target as Element).closest('.buy-now-btn');
    if (buyNowBtn) {
        if (!currentUser) {
            showAlert('Please log in to buy items.', 'Login Required');
            return;
        }
        const productId = parseInt((buyNowBtn as HTMLElement).dataset.productId);
        // Directly add to cart, then navigate to checkout
        const existingItem = userCart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            userCart.push({ productId, quantity: 1 });
        }
        await updateCartInFirebase(userCart);
        showPage('delivery-address');
    }

    const removeFromCartBtn = (e.target as Element).closest('.remove-from-cart-btn');
    if (removeFromCartBtn) {
        const productId = parseInt((removeFromCartBtn as HTMLElement).dataset.productId);
        userCart = userCart.filter(item => item.productId !== productId);
        await updateCartInFirebase(userCart);
    }

    const cartQuantityBtn = (e.target as Element).closest('.cart-quantity-btn');
    if (cartQuantityBtn) {
        const productId = parseInt((cartQuantityBtn as HTMLElement).dataset.productId);
        const action = (cartQuantityBtn as HTMLElement).dataset.action;
        const itemIndex = userCart.findIndex(item => item.productId === productId);

        if (itemIndex !== -1) {
            if (action === 'increment') {
                userCart[itemIndex].quantity++;
            } else if (action === 'decrement' && userCart[itemIndex].quantity > 1) {
                userCart[itemIndex].quantity--;
            }
            await updateCartInFirebase(userCart);
        }
    }

    const productCard = (e.target as Element).closest('.product-card');
    if (productCard && !addToCartBtn && !(e.target as Element).closest('.favorite-toggle')) {
        const productId = (productCard as HTMLElement).dataset.productId;
        showPage('details', productId);
    }

    const favoriteToggle = (e.target as Element).closest('.favorite-toggle');
    if (favoriteToggle) {
        e.stopPropagation(); // Prevent card click event
        if (!currentUser) {
            showAlert('Please log in to add items to wishlist.', 'Login Required');
            return;
        }
        const productId = parseInt((favoriteToggle as HTMLElement).dataset.productId);
        const icon = favoriteToggle.querySelector('i');

        if (userWishlist.includes(productId)) {
            // Remove from wishlist
            userWishlist = userWishlist.filter(id => id !== productId);
            icon.classList.remove('fas');
            icon.classList.add('far');
            favoriteToggle.classList.remove('text-red-500');
            showAlert('Removed from wishlist.', 'Wishlist');
        } else {
            // Add to wishlist
            userWishlist.push(productId);
            icon.classList.remove('far');
            icon.classList.add('fas');
            favoriteToggle.classList.add('text-red-500');
            showAlert('Added to wishlist!', 'Wishlist');
        }
        await updateWishlistInFirebase(userWishlist.map(id => ({ productId: id }))); // Store as objects in DB
        renderFavorites(); // Re-render favorites page if active
    }
});

// Search functionality
function handleSearch(query) {
    if (query.trim()) {
        currentSearchQuery = query;
        renderSearchResults(query, true);
    } else {
        showAlert('Please enter a search query.', 'Empty Search');
    }
}
desktopSearchBtn.addEventListener('click', () => handleSearch(desktopSearchInput.value));
mobileSearchBtn.addEventListener('click', () => handleSearch(mobileSearchInput.value));
desktopSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(desktopSearchInput.value); });
mobileSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(mobileSearchInput.value); });

// Filter and Sort Modal
document.getElementById('filter-sort-btn').addEventListener('click', () => filterSortModal.classList.add('flex'));
document.getElementById('listing-filter-sort-btn').addEventListener('click', () => filterSortModal.classList.add('flex'));
document.querySelector('#filter-sort-modal .modal-close-btn').addEventListener('click', () => filterSortModal.classList.remove('flex'));

applyFilterSortBtn.addEventListener('click', () => {
    // Fix for errors on lines 841, 842: Property 'value' does not exist on type 'Element'.
    // Cast elements to HTMLInputElement to access 'value' and 'checked' properties.
    const selectedSort = (document.querySelector('input[name="sort-price"]:checked') as HTMLInputElement)?.value || 'lowToHigh';
    const selectedCategories = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="filter-category"]:checked')).map(cb => cb.value);

    // For simplicity, if multiple categories are selected, it filters by the first one or shows all if none.
    const categoryToFilter = selectedCategories.length > 0 ? selectedCategories[0] : null;

    if (document.getElementById('search-results-page').classList.contains('active')) {
        renderSearchResults(currentSearchQuery, false); // Filter search results
    } else {
        renderProductListing(categoryToFilter, selectedSort, false); // Filter general listing
    }
    filterSortModal.classList.remove('flex');
});

// --- PROFILE PAGE ---
profilePicUpload.addEventListener('change', async (e) => {
    if (!currentUser) {
        showAlert('Please log in to upload a profile picture.', 'Login Required');
        return;
    }
    // Fix for error on line 861: Property 'files' does not exist on type 'EventTarget'.
    // Cast e.target to HTMLInputElement to access the 'files' property.
    const file = (e.target as HTMLInputElement).files[0];
    if (file) {
        const imageRef = storageRef(storage, `user_profiles/${currentUser.uid}/profile.jpg`);
        try {
            await uploadBytes(imageRef, file);
            const photoURL = await getDownloadURL(imageRef);
            await update(ref(database, `users/${currentUser.uid}/profile`), { profilePic: photoURL });
            showAlert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            showAlert('Failed to upload profile picture. Please try again.');
        }
    }
});

updateProfileBtn.addEventListener('click', async () => {
    if (!currentUser) {
        showAlert('Please log in to update your profile.', 'Login Required');
        return;
    }
    // Fix for error on line 881: Property 'value' does not exist on type 'HTMLElement'.
    // This is fixed by casting profileNameInput as HTMLInputElement at declaration.
    const newName = profileNameInput.value.trim();
    if (newName) {
        try {
            await update(ref(database, `users/${currentUser.uid}/profile`), { name: newName });
            showAlert('Profile name updated successfully!');
        } catch (error) {
            console.error('Error updating profile name:', error);
            showAlert('Failed to update profile name. Please try again.');
        }
    } else {
        showAlert('Name cannot be empty.', 'Validation Error');
    }
});

function renderProfilePage() {
    if (!currentUser) {
        // Show login/signup view if not logged in
        document.getElementById('profile-view').classList.add('hidden');
        document.getElementById('login-signup-view').classList.remove('hidden');
        // You might want to render the login modal directly here or a simplified version
        document.getElementById('login-signup-view').innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Login or Sign Up</h2>
            <p class="mb-6 text-gray-600">To access your profile, please log in or create an account.</p>
            <button class="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary-dark transition" onclick="document.getElementById('login-modal').classList.add('flex');">Login / Sign Up</button>
        `;
    } else {
        // Show actual profile view
        document.getElementById('profile-view').classList.remove('hidden');
        document.getElementById('login-signup-view').classList.add('hidden');
        // Data is already fetched by onAuthStateChanged listener, just ensure fields are populated
        // This is handled by the onValue listener for `users/${user.uid}/profile`
    }
}

// --- MY ORDERS PAGE ---
function renderMyOrders() {
    if (!currentUser) {
        ordersContainer.innerHTML = '';
        ordersEmptyMessage.textContent = 'Please log in to view your orders.';
        ordersEmptyMessage.classList.remove('hidden');
        return;
    }

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '';
        ordersEmptyMessage.textContent = 'You have no past orders.';
        ordersEmptyMessage.classList.remove('hidden');
        return;
    }
    ordersEmptyMessage.classList.add('hidden');

    ordersContainer.innerHTML = userOrders.sort((a,b) => b.orderDate - a.orderDate).map(order => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        return `
            <div class="bg-white p-4 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-lg">Order ID: ${order.orderId}</h4>
                    <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">${order.status}</span>
                </div>
                <p class="text-gray-600 mb-1">Order Date: ${orderDate}</p>
                <p class="text-gray-600 mb-1">Items: ${totalItems}</p>
                <p class="font-bold text-xl">Total: ₹${order.total.toLocaleString('en-IN')}</p>
                <button class="mt-3 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition view-order-details-btn" data-order-id="${order.orderId}">View Details</button>
            </div>
        `;
    }).join('');
}

// --- TRACK ORDER PAGE ---
function renderTrackOrder(orderId) {
    const order = userOrders.find(o => o.orderId === orderId);
    if (!order) {
        trackOrderIdSpan.textContent = `#${orderId}`;
        orderTimeline.innerHTML = '';
        trackOrderNotFound.classList.remove('hidden');
        return;
    }
    trackOrderNotFound.classList.add('hidden');

    trackOrderIdSpan.textContent = `#${orderId}`;
    const statuses = [
        { id: 'placed', label: 'Order Placed', icon: 'fa-clipboard-list' },
        { id: 'progress', label: 'In Progress', icon: 'fa-cog' },
        { id: 'shipped', label: 'Shipped', icon: 'fa-truck' },
        { id: 'delivered', label: 'Delivered', icon: 'fa-box-open' },
        { id: 'cancelled', label: 'Cancelled', icon: 'fa-times-circle' } // This would be an alternative final state
    ];

    orderTimeline.innerHTML = statuses.map(status => {
        const isActive = order.status.toLowerCase() === status.id || (order.status.toLowerCase() !== 'cancelled' && statuses.indexOf(status) <= statuses.findIndex(s => s.id === order.status.toLowerCase()));
        const isCancelled = order.status.toLowerCase() === 'cancelled' && status.id === 'cancelled';
        const statusDate = order.statusHistory?.[status.id] ? new Date(order.statusHistory[status.id]).toLocaleString() : '';
        return `
            <div class="timeline-item ${isActive ? 'active' : ''} ${isCancelled ? 'text-red-500' : ''}">
                <div class="timeline-item-icon">
                    <i class="fas fa-check"></i>
                    <i class="fas ${status.icon}"></i>
                </div>
                <div class="timeline-item-content">
                    <h4 class="font-semibold">${status.label}</h4>
                    <p class="text-sm text-gray-500">${statusDate}</p>
                    ${order.status.toLowerCase() === status.id && order.statusMessage ? `<p class="text-sm mt-1">${order.statusMessage}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

document.body.addEventListener('click', (e) => {
    // Fix for error on line 991: Property 'closest' does not exist on type 'EventTarget'.
    // Cast e.target to Element.
    const viewDetailsBtn = (e.target as Element).closest('.view-order-details-btn');
    if (viewDetailsBtn) {
        const orderId = (viewDetailsBtn as HTMLElement).dataset.orderId;
        showPage('track-order', null, orderId);
    }
});

// --- DELIVERY ADDRESS & CHECKOUT ---
pincodeInput.addEventListener('input', async () => {
    // Fix for error on line 1000: Property 'value' does not exist on type 'HTMLElement'.
    // Fixed by casting pincodeInput at declaration.
    const pincode = pincodeInput.value;
    if (pincode.length === 6) {
        const data = await fetchJSON(`https://api.postalpincode.in/pincode/${pincode}`);
        if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            // Fix for errors on lines 1005, 1006: Property 'value' does not exist on type 'HTMLElement'.
            // Fixed by casting cityInput and stateInput at declaration.
            cityInput.value = postOffice.District;
            stateInput.value = postOffice.State;
        } else {
            // Fix for errors on lines 1008, 1009: Property 'value' does not exist on type 'HTMLElement'.
            // Fixed by casting cityInput and stateInput at declaration.
            cityInput.value = '';
            stateInput.value = '';
            showAlert('Invalid Pincode or no data found.', 'Pincode Error');
        }
    } else {
        // Fix for errors on lines 1013, 1014: Property 'value' does not exist on type 'HTMLElement'.
        // Fixed by casting cityInput and stateInput at declaration.
        cityInput.value = '';
        stateInput.value = '';
    }
});

addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        showAlert('Please log in to place an order.', 'Login Required');
        return;
    }

    if (userCart.length === 0) {
        showAlert('Your cart is empty. Please add items before placing an order.', 'Empty Cart');
        return;
    }

    // Fix for errors on lines 1031-1037: Property 'value' does not exist on type 'HTMLElement'.
    // Fixed by casting address form inputs at declaration.
    const addressDetails = {
        fullName: fullNameInput.value,
        mobileNumber: mobileNumberInput.value,
        pincode: pincodeInput.value,
        city: cityInput.value,
        state: stateInput.value,
        addressLine1: addressLine1Input.value,
        addressLine2: addressLine2Input.value,
    };

    // Save/Update user address in Firebase
    await set(ref(database, `users/${currentUser.uid}/address`), addressDetails);

    // Fix for error on line 1043: Property 'value' does not exist on type 'Element'.
    // Cast to HTMLInputElement to access 'value'.
    const paymentMethod = (document.querySelector('input[name="payment-method"]:checked') as HTMLInputElement).value;
    const totalAmount = userCart.reduce((acc, item) => {
        const product = allProductsData.find(p => p.id === item.productId);
        return acc + (parseFloat(product.price.replace(/,/g, '')) * item.quantity);
    }, 0);

    if (paymentMethod === 'Online') {
        // PayPal Integration (Dummy/Placeholder)
        // In a real app, this would initiate a PayPal checkout flow
        showAlert('Online payment selected. Integrating PayPal (dummy action).', 'Payment');
        // Assume successful PayPal payment for now
        setTimeout(() => placeOrder(addressDetails, totalAmount, paymentMethod), 1000);
    } else {
        placeOrder(addressDetails, totalAmount, paymentMethod);
    }
});

async function placeOrder(address, total, paymentMethod) {
    if (!currentUser) return;

    const orderId = `ORD${Date.now()}`;
    const orderItems = userCart.map(item => {
        const product = allProductsData.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: item.quantity,
        };
    });

    const newOrder = {
        orderId: orderId,
        userId: currentUser.uid,
        orderDate: Date.now(),
        items: orderItems,
        address: address,
        total: total,
        paymentMethod: paymentMethod,
        status: 'placed', // initial status
        statusHistory: {
            placed: Date.now()
        },
        statusMessage: 'Your order has been placed successfully.'
    };

    try {
        // Save order to Firebase
        await set(ref(database, `orders/${currentUser.uid}/${orderId}`), newOrder);

        // Clear cart in Firebase
        await remove(ref(database, `carts/${currentUser.uid}`));
        userCart = []; // Clear local cart as well

        confirmedOrderIdSpan.textContent = orderId;
        showPage('order-confirmation');
        showAlert(`Order ${orderId} placed successfully!`, 'Order Confirmed');
    } catch (error) {
        console.error('Error placing order:', error);
        showAlert('Failed to place order. Please try again.', 'Order Failed');
    }
}

// --- INITIALIZATION ---
function init() {
    loadInitialData();
    renderCart(); // Initial render for cart, will update on auth state change
    renderFavorites(); // Initial render for favorites
    renderMyOrders(); // Initial render for orders
    showPage('home'); // Always start on the home page
}

init();
