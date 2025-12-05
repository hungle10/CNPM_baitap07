import { IResolvers } from '@graphql-tools/utils';
import {
  products,
  carts,
  enrichCart,
  getOrCreateCart,
  generateCartItemId,
  generateProductId,
} from './models';

export const resolvers: IResolvers = {
  Query: {
    // ===============================
    // PRODUCT QUERIES
    // ===============================
    products: () => products,

    product: (_, { id }: { id: string }) => {
      return products.find((p) => p.id === id);
    },

    // ===============================
    // CART QUERIES
    // ===============================
    cart: (_, { userId }: { userId: string }) => {
      const cart = getOrCreateCart(userId);
      return enrichCart(cart);
    },

    getCheckoutInfo: (_, { userId }: { userId: string }) => {
      const cart = getOrCreateCart(userId);
      const enrichedCart = enrichCart(cart);

      return {
        cartId: enrichedCart.id,
        selectedItems: enrichedCart.checkoutItems,
        totalPrice: enrichedCart.checkoutTotalPrice,
        totalQuantity: enrichedCart.checkoutItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      };
    },
  },

  Mutation: {
    // ===============================
    // PRODUCT MUTATIONS
    // ===============================
    createProduct: (_, { input }: any) => {
      const newProduct = {
        id: generateProductId(),
        name: input.name,
        price: input.price,
        image: input.image || null,
        description: input.description || null,
      };
      products.push(newProduct);
      return newProduct;
    },

    updateProduct: (_, { input }: any) => {
      const product = products.find((p) => p.id === input.id);
      if (!product) throw new Error(`Product ${input.id} not found`);

      if (input.name) product.name = input.name;
      if (input.price) product.price = input.price;
      if (input.image) product.image = input.image;
      if (input.description) product.description = input.description;

      return product;
    },

    deleteProduct: (_, { id }: { id: string }) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return { success: false, message: `Product ${id} not found` };
      }
      products.splice(index, 1);
      return { success: true, message: 'Product deleted successfully' };
    },

    clearAllProducts: () => {
      products.length = 0;
      return { success: true, message: 'All products cleared' };
    },

    // ===============================
    // CART MUTATIONS
    // ===============================
    addToCart: (_, { input }: any) => {
      const { userId, productId, quantity } = input;
      const product = products.find((p) => p.id === productId);

      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      const cart = getOrCreateCart(userId);
      const existingItem = cart.items.find((i) => i.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          id: generateCartItemId(),
          productId,
          quantity,
          selectedForCheckout: false,
        });
      }

      return enrichCart(cart);
    },

    updateCartItem: (_, { input }: any) => {
      const { cartItemId, quantity } = input;

      let foundCart: any = null;
      let foundItem: any = null;

      for (const cart of carts) {
        const item = cart.items.find((i) => i.id === cartItemId);
        if (item) {
          foundCart = cart;
          foundItem = item;
          break;
        }
      }

      if (!foundItem) {
        throw new Error(`Cart item ${cartItemId} not found`);
      }

      if (quantity <= 0) {
        foundCart.items = foundCart.items.filter((i: any) => i.id !== cartItemId);
      } else {
        foundItem.quantity = quantity;
      }

      return enrichCart(foundCart);
    },

    removeCartItem: (_, { input }: any) => {
      const { cartItemId } = input;

      let foundCart: any = null;

      for (const cart of carts) {
        const item = cart.items.find((i) => i.id === cartItemId);
        if (item) {
          foundCart = cart;
          break;
        }
      }

      if (!foundCart) {
        throw new Error(`Cart item ${cartItemId} not found`);
      }

      foundCart.items = foundCart.items.filter((i: any) => i.id !== cartItemId);
      return enrichCart(foundCart);
    },

    selectCartItem: (_, { input }: any) => {
      const { cartItemId, selected } = input;

      let foundCart: any = null;
      let foundItem: any = null;

      for (const cart of carts) {
        const item = cart.items.find((i) => i.id === cartItemId);
        if (item) {
          foundCart = cart;
          foundItem = item;
          break;
        }
      }

      if (!foundItem) {
        throw new Error(`Cart item ${cartItemId} not found`);
      }

      foundItem.selectedForCheckout = selected;
      return enrichCart(foundCart);
    },

    selectMultipleItems: (_, { input }: any) => {
      const { cartId, itemIds, selected } = input;

      const cart = carts.find((c) => c.id === cartId);
      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }

      cart.items.forEach((item: any) => {
        if (itemIds.includes(item.id)) {
          item.selectedForCheckout = selected;
        }
      });

      return enrichCart(cart);
    },

    clearCart: (_, { input }: any) => {
      const { cartId } = input;

      const cart = carts.find((c) => c.id === cartId);
      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }

      cart.items = [];
      return enrichCart(cart);
    },

    checkout: (_, { userId }: { userId: string }) => {
      const cart = carts.find((c) => c.userId === userId);
      if (!cart) {
        return { success: false, message: 'Cart not found' };
      }

      const checkoutItems = cart.items.filter((i) => i.selectedForCheckout);
      if (checkoutItems.length === 0) {
        return { success: false, message: 'No items selected for checkout' };
      }

      // Simulate checkout
      console.log(`Checkout for user ${userId}:`, checkoutItems);

      // Clear selected items
      cart.items = cart.items.filter((i) => !i.selectedForCheckout);

      return {
        success: true,
        message: `Thanh toán thành công ${checkoutItems.length} sản phẩm!`,
      };
    },
  },
};
