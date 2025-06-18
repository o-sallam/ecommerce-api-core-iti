const endpointMap = {
  "Endpoints": {
    "GET /": "Displays this endpoint map"
  },
  "Authentication": {
    "POST /auth/login": "User login. Expects {email, password} in body. Returns a JWT token.",
    "POST /auth/register": "User registration. Expects {username, email, password} in body."
  },
  "Users": {
    "GET /users": "Get all users."
  },
  "Products": {
    "GET /products": "Get all products.",
    "GET /products/:id": "Get a single product by ID.",
    "GET /products/related/:id": "Get products related to a product by ID.",
    "GET /products/featured": "Get all featured products.",
    "POST /products": "Create a new product.",
    "POST /products/bulk": "Add multiple products in bulk.",
    "PUT /products/:id": "Update a product by ID.",
    "PUT /products/bulk": "Update multiple products in bulk.",
    "PUT /products/images/update-all": "Update images for all products.",
    "DELETE /products": "Delete all products."
  },
  "Cart": {
    "GET /cart": "Get all carts.",
    "GET /cart/me": "Get the authenticated user's cart using the JWT token in the Authorization header.",
    "POST /cart/increase": "Increase product quantity in cart. Expects JWT token in Authorization header and {productId} in body.",
    "POST /cart/decrease": "Decrease product quantity in cart. Expects {userId, productId} in body.",
    "DELETE /cart/delete/:id": "Delete a product from the cart.",
    "DELETE /cart/deleteAll": "Delete all items from the cart."
  },
  "Categories": {
    "GET /categories": "Get all categories.",
    "POST /categories": "Create a new category."
  }
};

module.exports = endpointMap;
