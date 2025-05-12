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

  const addToCart = (product) => {
    setCart([...cart, { price: product.priceId, quantity: 1 }]);
  };

  const handleCheckout = async () => {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart }),
  });
  const { sessionId } = await response.json(); // <-- Correction ici
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
            <button onClick={() => addToCart(prod)}>Ajouter au panier</button>
          </li>
        ))}
      </ul>

      <h2>Panier</h2>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>{PRODUCTS.find(p => p.priceId === item.price)?.name}</li>
        ))}
      </ul>

      {cart.length > 0 && (
        <button onClick={handleCheckout}>Payer</button>
      )}
    </div>
  );
}

export default App;
