import Navbar from "@/components/layout/navbar";
import { CartItems } from "@/components/shop/cart-items";
import { getCart } from "@/actions/cart";
import { auth } from "@/auth";

export default async function CartPage() {
  const session = await auth();
  const dbCart = await getCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Your Shopping Cart</h1>
        <CartItems dbCart={dbCart} isLoggedIn={!!session} />
      </main>
    </div>
  );
}
