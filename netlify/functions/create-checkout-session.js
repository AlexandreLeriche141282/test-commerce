const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  const { items } = JSON.parse(event.body);

  // Exemple d'items attendus : [{ price: 'prix_stripe', quantity: 1 }]
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: 'https://test-ecommerce-leriche.netlify.app/success',
      cancel_url: 'https://test-ecommerce-leriche.netlify.app/cancel',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
