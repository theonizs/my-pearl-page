// src/hooks/useCart.ts
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

export const useCart = () => {
  const [cart, setCart] = useState(useCartStore.getState());

  useEffect(() => {
    // รอจนกว่า Client จะ Hydrate เสร็จ
    const unsub = useCartStore.subscribe((state) => setCart(state));
    return () => unsub();
  }, []);

  // คำนวณค่าตรงนี้เพื่อให้ UI Update ได้แม่นยำ
  const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return { ...cart, totalPrice, totalItems };
};