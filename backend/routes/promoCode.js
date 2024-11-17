import express from "express";
import {
  getPromoCodes,
  createPromoCode,
  deletePromoCode,
  togglePromoCode,
  validatePromoCode
} from "../controllers/promoCodeController.js";

const PromoCodeRouter = express.Router();

PromoCodeRouter.get("/get", getPromoCodes);
PromoCodeRouter.post("/add", createPromoCode);
PromoCodeRouter.delete("/:id", deletePromoCode);
PromoCodeRouter.patch("/:id/toggle", togglePromoCode);
PromoCodeRouter.get("/:code/validate", validatePromoCode);

export default PromoCodeRouter;
