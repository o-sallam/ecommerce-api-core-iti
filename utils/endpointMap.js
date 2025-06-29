const endpointMap = {
  Endpoints: {
    "GET /": "Displays this endpoint map",
  },
  Authentication: {
    "POST /auth/login":
      "User login. Expects {email, password} in body. Returns a JWT token.",
    "POST /auth/register":
      "User registration. Expects {username, email, password} in body.",
  },
  Users: {
    "GET /users": "Get all users.",
  },
  Products: {
    "GET /products": "Get all products.",
    "GET /products/category/:categoryName":
      "Get all products by category name. Expects :categoryName as a route parameter (e.g., /products/category/Electronics). Returns an array of products in the specified category.",
    "GET /products/:id": "Get a single product by ID.",
    "GET /products/related/:id": "Get products related to a product by ID.",
    "GET /products/featured": "Get all featured products.",
    "POST /products": "Create a new product.",
    "POST /products/bulk": "Add multiple products in bulk.",
    "PUT /products/:id": "Update a product by ID.",
    "PUT /products/bulk": "Update multiple products in bulk.",
    "PUT /products/images/update-all": "Update images for all products.",
    "DELETE /products": "Delete all products.",
  },
  Cart: {
    "GET /cart": "[ADMIN ONLY] Get all carts.",
    "GET /cart/me":
      "Get the authenticated user's cart. Requires JWT token in Authorization header as 'Bearer <token>'.",
    "POST /cart/increase":
      "Increase product quantity in the authenticated user's cart. Requires JWT token in Authorization header and {productId} in body.",
    "POST /cart/decrease":
      "Decrease product quantity in the authenticated user's cart. Requires JWT token in Authorization header and {productId} in body.",
    "DELETE /cart/item":
      "Delete a specific item from the authenticated user's cart. Requires JWT token in Authorization header and {productId} in body.",
    "DELETE /cart/deleteAll":
      "Delete all items from the authenticated user's cart. Requires JWT token in Authorization header.",
  },
  Categories: {
    "GET /categories": "Get all categories.",
    "POST /categories": "Create a new category.",
    "PUT /categories/:id":
      "Update a category by ID. Expects {name, description, image} in body.",
  },
  Wishlist: {
    "GET /wishlist":
      "Get the authenticated user's wishlist. Requires JWT token in Authorization header as 'Bearer <token>'.",
    "POST /wishlist/add":
      "Add a product to the authenticated user's wishlist. Requires JWT token in Authorization header and {productId} in body.",
    "DELETE /wishlist/remove":
      "Remove a product from the authenticated user's wishlist. Requires JWT token in Authorization header and {productId} in body.",
    "DELETE /wishlist/clear":
      "Clear all items from the authenticated user's wishlist. Requires JWT token in Authorization header.",
    "GET /wishlist/check/:productId":
      "Check if a product is in the authenticated user's wishlist. Requires JWT token in Authorization header.",
    "GET /wishlist/admin/all": "[ADMIN ONLY] Get all wishlists.",
  },
  Orders: {
    "POST /orders/confirm":
      "Confirm order submission. Requires JWT token in Authorization header. Expects {shippingAddress: {firstName, lastName, email, phone, address, city, country, zipCode}, paymentMethod, items: [{productId, quantity, price}], total, notes?} in body. Returns {ok, remainingDays, orderId, message}.",
    "GET /orders":
      "Get the authenticated user's orders. Requires JWT token in Authorization header as 'Bearer <token>'.",
    "GET /orders/:orderId":
      "Get a specific order by ID. Requires JWT token in Authorization header as 'Bearer <token>'.",
    "PUT /orders/:orderId/cancel":
      "Cancel an order. Requires JWT token in Authorization header as 'Bearer <token>'.",
  },
};

module.exports = endpointMap;
