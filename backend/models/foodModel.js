import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  dietary: { type: String, required: true },
  category: { type: String, required: true },
  calories: { type: Number, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
