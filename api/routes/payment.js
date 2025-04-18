const userService = require("../services/userService");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: process.env.STRIPE_API_VERSION,
});

const cors = require("cors");
const express = require("express");
const router = express.Router();

//Adapted from Stripe Quickstart Documentation for Node.js/React Implementation:
//https://docs.stripe.com/checkout/custom/quickstart?lang=node&client=react
router.post("/create-session", async (req, res, next) => {
    try {
        const uid = req.user?.uid;
        if (!uid) return res.status(401).send();

        const user = await userService.getUserByFirebaseId(uid);

        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                user_id: user.userId,
            },
            customer_email: user.email,
            return_url: `${
                process.env.CLIENT_URL ??
                process.env.API_URL ??
                "http://localhost:5173"
            }/settings`,
        });

        return res.send({
            clientSecret: session.client_secret,
            sessionId: session.id,
        });
    } catch (error) {
        next(error);
    }
});

const webhookRouter = express.Router();
//Adapted from stripe webhooks guide
//https://docs.stripe.com/webhooks
webhookRouter.post(
    "/",
    cors(),
    express.raw({ type: "application/json" }),
    async (req, res) => {
        //Lock-down webhook endpoint so only requests with a valid stripe-signature are allowed.
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_ENDPOINT_SECRET
            );
        } catch (err) {
            console.error("Webhook error: ", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                if (session.status == "complete") {
                    await userService.setUserPaid(session.metadata.user_id);
                    break;
                }
            default:
                console.warn(`Unhandled event type ${event.type}`);
        }
        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    }
);

module.exports = [router, webhookRouter];
