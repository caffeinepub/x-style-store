import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };

    public func compareByRating(p1 : Product, p2 : Product) : Order.Order {
      switch (Float.compare(p2.rating, p1.rating)) {
        case (#equal) { Text.compare(p1.name, p2.name) };
        case (order) { order };
      };
    };
  };

  module CartItem {
    public func compare(c1 : CartItem, c2 : CartItem) : Order.Order {
      switch (Nat.compare(c1.productId, c2.productId)) {
        case (#equal) { Text.compare(c1.selectedSize, c2.selectedSize) };
        case (order) { order };
      };
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    shortDescription : Text;
    longDescription : Text;
    category : Text;
    sizes : [Text];
    price : Nat;
    mrp : Nat;
    discountPercent : Nat;
    rating : Float;
    reviewCount : Nat;
    badge : ?Text;
    imageCount : Nat;
  };

  public type CartItem = {
    productId : Nat;
    selectedSize : Text;
    quantity : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, Map.Map<Nat, CartItem>>();
  let wishlists = Map.empty<Principal, Set.Set<Nat>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Cart Management
  public shared ({ caller }) func addToCart(productId : Nat, size : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    if (quantity == 0) { Runtime.trap("Quantity must be at least 1") };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let item : CartItem = { productId; selectedSize = size; quantity };
    let userCart = switch (carts.get(caller)) {
      case (null) {
        let newCart = Map.empty<Nat, CartItem>();
        newCart.add(productId, item);
        newCart;
      };
      case (?cart) {
        cart.add(productId, item);
        cart;
      };
    };

    carts.add(caller, userCart);
  };

  public shared ({ caller }) func updateCartQty(productId : Nat, newQuantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };

    if (newQuantity == 0) { Runtime.trap("Quantity must be at least 1") };
    let userCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let existingItem = switch (userCart.get(productId)) {
      case (null) { Runtime.trap("Item not found in cart") };
      case (?item) { item };
    };

    let updatedItem = { existingItem with quantity = newQuantity };
    userCart.add(productId, updatedItem);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    let userCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    userCart.remove(productId);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.values().toArray().sort() };
    };
  };

  // Wishlist Management
  public shared ({ caller }) func toggleWishlist(productId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can use wishlist");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let userWishlist = switch (wishlists.get(caller)) {
      case (null) {
        let newWishlist = Set.empty<Nat>();
        newWishlist.add(productId);
        newWishlist;
      };
      case (?wishlist) {
        if (wishlist.contains(productId)) {
          wishlist.remove(productId);
        } else {
          wishlist.add(productId);
        };
        wishlist;
      };
    };

    wishlists.add(caller, userWishlist);
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get wishlist");
    };

    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  public query ({ caller }) func isWishlisted(productId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check wishlist");
    };

    switch (wishlists.get(caller)) {
      case (null) { false };
      case (?wishlist) { wishlist.contains(productId) };
    };
  };

  // Product Queries (Public - accessible to all including guests)
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filtered.sort();
  };

  public query ({ caller }) func getProductById(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getBestsellers() : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        switch (product.badge) {
          case (?badge) { badge == "Best Seller" };
          case (null) { false };
        };
      }
    );
    filtered.sort(Product.compareByRating);
  };

  // Admin Functions
  let sampleProducts = [
    {
      id = 1;
      name = "Floral Print Top";
      shortDescription = "Stylish floral print top";
      longDescription = "A beautiful floral print top perfect for casual outings.";
      category = "Tops";
      sizes = ["S", "M", "L", "XL"];
      price = 9999;
      mrp = 14999;
      discountPercent = 33;
      rating = 4.7;
      reviewCount = 150;
      badge = ?"Best Seller";
      imageCount = 3;
    },
    {
      id = 2;
      name = "Denim Co-ord Set";
      shortDescription = "Trendy denim co-ord set";
      longDescription = "A cool and comfortable denim co-ord set suitable for everyday wear.";
      category = "Co-ord Sets";
      sizes = ["XS", "S", "M", "L"];
      price = 17599;
      mrp = 25000;
      discountPercent = 30;
      rating = 4.2;
      reviewCount = 65;
      badge = null;
      imageCount = 4;
    },
    {
      id = 3;
      name = "Cotton Kurti";
      shortDescription = "Elegant cotton kurti";
      longDescription = "A lightweight and breathable cotton kurti ideal for summers.";
      category = "Ethnic Wear";
      sizes = ["M", "L", "XL"];
      price = 8999;
      mrp = 11999;
      discountPercent = 25;
      rating = 4.5;
      reviewCount = 70;
      badge = ?"Best Seller";
      imageCount = 2;
    },
    {
      id = 4;
      name = "Party Dress";
      shortDescription = "Stylish party dress";
      longDescription = "A beautiful dress suitable for parties and special occasions.";
      category = "Party Wear";
      sizes = ["S", "M", "L"];
      price = 12999;
      mrp = 16999;
      discountPercent = 24;
      rating = 4.3;
      reviewCount = 100;
      badge = null;
      imageCount = 3;
    },
    {
      id = 5;
      name = "Puff-Sleeve Top";
      shortDescription = "Trendy puff-sleeve design";
      longDescription = "A fashionable top featuring trendy puff sleeves.";
      category = "Tops";
      sizes = ["S", "M", "L", "XL"];
      price = 10999;
      mrp = 13999;
      discountPercent = 21;
      rating = 4.6;
      reviewCount = 80;
      badge = null;
      imageCount = 2;
    },
    {
      id = 6;
      name = "Printed Palazzo Set";
      shortDescription = "Printed palazzo set for casual wear";
      longDescription = "A comfortable set featuring a top and printed palazzo pants.";
      category = "Co-ord Sets";
      sizes = ["M", "L", "XL"];
      price = 14999;
      mrp = 19999;
      discountPercent = 25;
      rating = 4.2;
      reviewCount = 45;
      badge = null;
      imageCount = 4;
    },
    {
      id = 7;
      name = "Casual Shirt";
      shortDescription = "Versatile casual shirt";
      longDescription = "A comfortable and versatile shirt suitable for various occasions.";
      category = "Shirts";
      sizes = ["S", "M", "L", "XL", "XXL"];
      price = 8999;
      mrp = 11999;
      discountPercent = 25;
      rating = 4.3;
      reviewCount = 85;
      badge = ?"Best Seller";
      imageCount = 3;
    },
    {
      id = 8;
      name = "Maxi Dress";
      shortDescription = "Elegant maxi dress for all occasions";
      longDescription = "An elegant maxi dress suitable for both casual and formal events.";
      category = "Dresses";
      sizes = ["XS", "S", "M"];
      price = 16499;
      mrp = 21999;
      discountPercent = 25;
      rating = 4.1;
      reviewCount = 60;
      badge = null;
      imageCount = 4;
    },
    {
      id = 9;
      name = "Kurta Set";
      shortDescription = "Traditional kurta set";
      longDescription = "A traditional kurta set perfect for festive occasions.";
      category = "Ethnic Wear";
      sizes = ["M", "L", "XL"];
      price = 13999;
      mrp = 18999;
      discountPercent = 26;
      rating = 4.5;
      reviewCount = 55;
      badge = null;
      imageCount = 3;
    },
    {
      id = 10;
      name = "Mini Dress";
      shortDescription = "Chic mini dress for parties";
      longDescription = "A stylish and chic mini dress perfect for parties and outings.";
      category = "Party Wear";
      sizes = ["S", "M"];
      price = 11499;
      mrp = 14999;
      discountPercent = 23;
      rating = 4.6;
      reviewCount = 90;
      badge = null;
      imageCount = 2;
    },
    {
      id = 11;
      name = "Sheer Top";
      shortDescription = "Sheer fabric top for layering";
      longDescription = "A sheer fabric top ideal for layering and adding style.";
      category = "Tops";
      sizes = ["S", "M", "L"];
      price = 8999;
      mrp = 12999;
      discountPercent = 31;
      rating = 4.5;
      reviewCount = 40;
      badge = null;
      imageCount = 3;
    },
    {
      id = 12;
      name = "Plaid Shirt";
      shortDescription = "Classic plaid pattern shirt";
      longDescription = "A timeless plaid pattern shirt suitable for any occasion.";
      category = "Shirts";
      sizes = ["M", "L", "XL"];
      price = 10999;
      mrp = 14999;
      discountPercent = 27;
      rating = 4.4;
      reviewCount = 75;
      badge = ?"Best Seller";
      imageCount = 4;
    },
  ];

  public shared ({ caller }) func seedProducts() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin can seed products");
    };

    for (product in sampleProducts.values()) {
      products.add(product.id, product);
    };
  };
};
