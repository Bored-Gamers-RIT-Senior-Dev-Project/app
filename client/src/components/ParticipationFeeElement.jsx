import { Button, Dialog, Paper, Typography } from "@mui/material";
import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";
import propTypes from "../utils/propTypes";
//Load stripe with publishable key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({ open, setOpen }) => {
    const fetchClientSecret = useCallback(
        () =>
            api
                .post("payment/create-session")
                .then(({ data }) => data.clientSecret),
        []
    );

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </Dialog>
    );
};

StripeCheckout.propTypes = {
    open: propTypes.bool.isRequired,
    setOpen: propTypes.func.isRequired,
};

const ParticipationFeeElement = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    if (!user || ![6, 7].includes(user.roleId)) {
        return null;
    }
    if (user.paid) {
        return (
            <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
                <Typography variant="h6">You&apos;re All Set!</Typography>
                <Typography variant="body">
                    You&apos;ve paid your participation fee!
                </Typography>
            </Paper>
        );
    }
    return (
        <Paper variant="outlined" sx={{ mt: 3, padding: 2 }}>
            <Typography variant="h6">Payment Portal</Typography>
            <Button onClick={() => setOpen(true)}>
                Click here to pay registration fee with Stripe
            </Button>
            <StripeCheckout open={open} setOpen={setOpen} />
        </Paper>
    );
};

export { ParticipationFeeElement };
