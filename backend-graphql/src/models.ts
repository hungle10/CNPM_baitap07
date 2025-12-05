// ===========================
// Data Models
// ===========================

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedForCheckout: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

// ===========================
// In-Memory Database
// ===========================

export let products: Product[] = [
  {
    id: 'p1',
    name: 'Laptop Dell XPS 13',
    price: 25000000,
    image: 'https://via.placeholder.com/300x300?text=Laptop',
    description: 'Laptop mạnh mẽ cho công việc',
  },
  {
    id: 'p2',
    name: 'iPhone 15 Pro',
    price: 29000000,
    image: 'https://via.placeholder.com/300x300?text=iPhone',
    description: 'Smartphone flagship 2024',
  },
  {
    id: 'p3',
    name: 'AirPods Pro',
    price: 6500000,
    image: 'https://via.placeholder.com/300x300?text=AirPods',
    description: 'Tai nghe không dây chất lượng cao',
  },
  {
    id: 'p4',
    name: 'iPad Pro',
    price: 18000000,
    image: 'https://via.placeholder.com/300x300?text=iPad',
    description: 'Máy tính bảng mạnh mẽ',
  },
];

export let carts: Cart[] = [];

let cartAutoId = 1;
let cartItemAutoId = 1;
let productAutoId = 5;

// ===========================
// Helper Functions
// ===========================

export function enrichCart(cart: Cart) {
  const items = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const lineTotal = product.price * item.quantity;

    return {
      id: item.id,
      product,
      quantity: item.quantity,
      selectedForCheckout: item.selectedForCheckout,
      lineTotal,
    };
  });

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.lineTotal, 0);

  const checkoutItems = items.filter((i) => i.selectedForCheckout);
  const checkoutTotalPrice = checkoutItems.reduce((sum, i) => sum + i.lineTotal, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalQuantity,
    totalPrice,
    checkoutItems,
    checkoutTotalPrice,
  };
}

export function getOrCreateCart(userId: string) {
  let cart = carts.find((c) => c.userId === userId);

  if (!cart) {
    cart = {
      id: String(cartAutoId++),
      userId,
      items: [],
    };
    carts.push(cart);
  }

  return cart;
}

export function generateCartItemId() {
  return 'ci' + cartItemAutoId++;
}

export function generateProductId() {
  return 'p' + productAutoId++;
}
