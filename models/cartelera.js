const mongoose = require("mongoose");
const { Schema } = mongoose;


const CarteleraSchema = new Schema(
  {
    pelicula: { type: String },
  
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Cartelera", CarteleraSchema);
