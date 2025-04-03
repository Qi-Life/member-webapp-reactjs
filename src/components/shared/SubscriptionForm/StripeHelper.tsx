import Stripe from 'stripe'

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY)

const createSubscription = async (createSubscriptionRequest: any) => {
    // create a stripe customer
    try {
        const customer = await stripe.customers.create({
            name: createSubscriptionRequest.name,
            email: createSubscriptionRequest.email,
            payment_method: createSubscriptionRequest.paymentMethod,
            invoice_settings: {
                default_payment_method: createSubscriptionRequest.paymentMethod,
            },
        });
        // get the price id from the front-end
        const priceId = createSubscriptionRequest.priceId;
        // create a stripe subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_settings: {
                payment_method_options: {
                    card: {
                        request_three_d_secure: 'any',
                    },
                },
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        });
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        if (invoice.payment_intent) {
            const intent = invoice.payment_intent as Stripe.PaymentIntent;
            return {
                transactionId: subscription.id,
                clientSecret: intent.client_secret,
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: StripeHelper.tsx:44 ~ createSubscription ~ error:", error)
    }
}

const createPaymentIntent = async (createRequest: any) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: createRequest.amount,
        currency: 'usd',
        confirmation_method: 'manual', // Set confirmation_method to 'manual'
    });
    // Confirm the PaymentIntent by injecting the payment method
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: createRequest.paymentMethod,
        return_url: 'http://localhost:3000/payment'
    });
    // Check the status of the confirmed PaymentIntent
    if (confirmedPaymentIntent.status === 'succeeded') {
        // Payment was successfully confirmed
        console.log('Payment succeeded:', confirmedPaymentIntent);
    } else {
        // Payment confirmation failed or requires additional action
        console.log('Payment confirmation failed or requires action:', confirmedPaymentIntent);
    }
    return confirmedPaymentIntent
}

export { createSubscription, createPaymentIntent };