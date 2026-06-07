import Navbar from "@/components/layout/navbar";
import { CartItems } from "@/components/shop/cart-items";
import { getCart } from "@/actions/cart";
import { auth } from "@/auth";

export default async function CartPage() {
  const session = await auth();
  const dbCart = await getCart();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: "#F5EDE0" }}>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <p className="font-sans text-[10px] tracking-[0.25em] text-primary/70 uppercase mb-2">Your Order</p>
          <h1 className="font-serif text-4xl font-light mb-8" style={{ color: "#1A0E05" }}>Shopping Cart</h1>
          <CartItems dbCart={dbCart} isLoggedIn={!!session} />
        </div>
      </main>
    </div>
  );
}
