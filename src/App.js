import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51QaCU0D3vO200331ZnOVnKK7Ot6hnYsMKWfo4uiZpwO36Ai72l1YuJnKTMgo3j6I669csgtal5WkQjzcpWqsigOe00Bl3VIKyW'); // Mets ta clé publique Stripe ici

const PRODUCTS = [
  {
    id: 1,
    name: "T-shirt React",
    priceId: "price_1RO13GD3vO200331L49DBbpC", // Remplace par ton identifiant de prix Stripe
    price: 15,
  },
  {
    id: 2,
    name: "Mug JavaScript",
    priceId: "price_1RK0xyD3vO200331K5hMYAtE", // Remplace par ton identifiant de prix Stripe
    price: 20,
  },
];

function App() {
  const [cart, setCart] = useState([]);

  // Ajoute ou incrémente la quantité d'un produit dans le panier
  const addToCart = (product) => {
    setCart(prevCart => {
      const found = prevCart.find(item => item.price === product.priceId);
      if (found) {
        return prevCart.map(item =>
          item.price === product.priceId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { price: product.priceId, quantity: 1 }];
      }
    });
  };

  // Diminue la quantité ou retire le produit du panier
  const removeFromCart = (priceId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.price === priceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Calcule le total du panier
  const total = cart.reduce((sum, item) => {
    const prod = PRODUCTS.find(p => p.priceId === item.price);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });
    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Boutique Simple</h1>
      <ul>
        {PRODUCTS.map(prod => (
          <li key={prod.id}>
            {prod.name} - {prod.price}€
            <button onClick={() => addToCart(prod)} style={{ marginLeft: 10 }}>Ajouter au panier</button>
          </li>
        ))}
      </ul>

      <h2>Panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cart.map((item, idx) => {
            const prod = PRODUCTS.find(p => p.priceId === item.price);
            return (
              <li key={idx}>
                {prod?.name} - {item.quantity} × {prod?.price}€ = {item.quantity * prod?.price}€
                <button onClick={() => removeFromCart(item.price)} style={{ marginLeft: 10 }}>Retirer</button>
              </li>
            );
          })}
        </ul>
      )}

      <p><strong>Total : {total}€</strong></p>

      {cart.length > 0 && (
        <button onClick={handleCheckout}>Payer</button>
      )}
    </div>
  );
}

export default App;

