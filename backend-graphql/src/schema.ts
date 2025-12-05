import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # ===========================
  # Product
  # ===========================
  type Product {
    id: ID!
    name: String!
    price: Int!
    image: String
    description: String
  }

  input CreateProductInput {
    name: String!
    price: Int!
    image: String
    description: String
  }

  input UpdateProductInput {
    id: ID!
    name: String
    price: Int
    image: String
    description: String
  }

  # ===========================
  # Cart Item
  # ===========================
  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
    selectedForCheckout: Boolean!
    lineTotal: Int!
  }

  # ===========================
  # Cart
  # ===========================
  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem!]!
    totalQuantity: Int!
    totalPrice: Int!
    checkoutItems: [CartItem!]!
    checkoutTotalPrice: Int!
  }

  # ===========================
  # Checkout Info
  # ===========================
  type CheckoutInfo {
    cartId: ID!
    selectedItems: [CartItem!]!
    totalPrice: Int!
    totalQuantity: Int!
  }

  # ===========================
  # Response Types
  # ===========================
  type MessageResponse {
    success: Boolean!
    message: String!
  }

  # ===========================
  # Queries
  # ===========================
  type Query {
    # Product queries
    products: [Product!]!
    product(id: ID!): Product

    # Cart queries
    cart(userId: ID!): Cart
    getCheckoutInfo(userId: ID!): CheckoutInfo
  }

  # ===========================
  # Input Types
  # ===========================
  input AddToCartInput {
    userId: ID!
    productId: ID!
    quantity: Int!
  }

  input UpdateCartItemInput {
    cartItemId: ID!
    quantity: Int!
  }

  input RemoveCartItemInput {
    cartItemId: ID!
  }

  input SelectCartItemInput {
    cartItemId: ID!
    selected: Boolean!
  }

  input SelectMultipleItemsInput {
    cartId: ID!
    itemIds: [ID!]!
    selected: Boolean!
  }

  input ClearCartInput {
    cartId: ID!
  }

  # ===========================
  # Mutations
  # ===========================
  type Mutation {
    # Product CRUD
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): MessageResponse!
    clearAllProducts: MessageResponse!

    # Cart operations
    addToCart(input: AddToCartInput!): Cart!
    updateCartItem(input: UpdateCartItemInput!): Cart!
    removeCartItem(input: RemoveCartItemInput!): Cart!
    selectCartItem(input: SelectCartItemInput!): Cart!
    selectMultipleItems(input: SelectMultipleItemsInput!): Cart!
    clearCart(input: ClearCartInput!): Cart!
    checkout(userId: ID!): MessageResponse!
  }
`;
