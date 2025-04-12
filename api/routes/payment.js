//Adapted from Stripe Quickstart Documentation for Node.js/React Implementation:
//https://docs.stripe.com/checkout/custom/quickstart?lang=node&client=react

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: process.env.STRIPE_API_VERSION,
});

const express = require("express");
const router = express.Router();

router.post("/create-session", async (req, res) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();

    const session = await stripe.checkout.sessions.create({
        ui_mode: "custom",
        line_items: [
            {
                price: "price_1RAg6bC7w5sX5X3bc0EeN1Ed",
                quantity: 1,
            },
        ],
        mode: "payment",
    });

    return res.send({ clientSecret: session.client_secret });
});

router.post("/client-status", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
        req.body.session_id
    );

    return res.send({
        status: session.payment_status,
        customer_email: session.customer_details.email,
    });
});

module.exports = router;
