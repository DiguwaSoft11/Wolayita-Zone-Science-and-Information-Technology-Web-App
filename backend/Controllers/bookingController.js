import User from "../models/UserSchema.js";
import Expert from "../models/ExpertSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    // get currently booked expert
    const expert = await Expert.findById(req.params.expertId);
    const user = await User.findById(req.userId);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // calculate amount in smallest currency unit (cents)
    const amountInCents = Math.round(expert.ticketPrice * 100);

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/experts/${expert.id}`,
      customer_email: user.email,
      client_reference_id: req.params.expertId,
      line_items: [
        {
          price_data: {
            currency: "etb",
            unit_amount: amountInCents,
            product_data: {
              name: expert.name,
              description: expert.bio,
              images: [expert.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // create new booking
    const booking = new Booking({
      expert: expert._id,
      user: user._id,
      ticketPrice: expert.ticketPrice,
      session: session.id,
    });

    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Successfully paid", session });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
};
