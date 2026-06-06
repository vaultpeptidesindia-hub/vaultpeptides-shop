"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/use-cart";
import { mergeCart } from "@/actions/cart";

export function CartSync({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { items, clearCart } = useCart();
  const syncing = useRef(false);

  useEffect(() => {
    if (isLoggedIn && items.length > 0 && !syncing.current) {
      syncing.current = true;
      mergeCart(items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })))
        .then((res) => {
          if (res.success) clearCart();
        })
        .finally(() => {
          syncing.current = false;
        });
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
