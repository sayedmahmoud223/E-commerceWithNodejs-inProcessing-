import Stripe from 'stripe';

export async function stripePayment({
    stripe = new Stripe(process.env.PAYMENT_SECRET_KET),
    payment_method_types = ["card"],
    mode= "payment",
    customer_email = "sbendary977@gmail.com",
    line_items = [],
    metadata = {},
    success_url = process.env.success_url,
    cancel_url = process.env.cancel_url,
    discounts = []
} = {}){
    let session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        line_items,
        metadata,
        success_url,
        cancel_url,
        discounts,
    })
    return session
}

