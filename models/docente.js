const mongoose = require("mongoose");
const { Schema } = mongoose;


const DocenteSchema = new Schema(
  {
    docente: { type: String },
    periodo: { type: String },
    horas_docencia: { type: String },
    horas_planificacion: { type: String },
    horas_tutorias: { type: String },
    horas_gestion: { type: String },
    tipo_de_error: { type: String }

  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Docente", DocenteSchema);
