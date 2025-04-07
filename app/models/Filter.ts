import { Schema, model, models } from "mongoose";

const FilterSchema = new Schema({
  Disciplina: [String],
  Banca: [String],
  Instituicao: [String],
  Cargo: [String],
  Ano: [String],
  Modalidade: [String],
});

const Filter = models.Filter || model("Filter", FilterSchema);

export default Filter;
