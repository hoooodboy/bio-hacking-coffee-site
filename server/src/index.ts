import express from "express";
import cors from "cors";
import { paymentRouter } from "./routes/payment";
import { orderRouter } from "./routes/order";
import { userRouter } from "./routes/user";
import { inventoryRouter } from "./routes/inventory";
import { authRouter } from "./routes/auth";
import { couponRouter } from "./routes/coupon";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bio-hacking-coffee-site.vercel.app",
    "https://www.thezone.bio",
    "https://lockin-store.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "bio-hacking-coffee-api" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/coupons", couponRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
