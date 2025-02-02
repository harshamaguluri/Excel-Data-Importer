import mongoose, { Schema, Document } from 'mongoose';

export interface IData extends Document {
  Name: string;
  Amount: number;
  Date: Date;
  Verified: string;
}

const DataSchema: Schema = new Schema({
  Name: { type: String, required: true },
  Amount: { type: Number, required: true },
  Date: { type: Date, required: true },
  Verified: { type: String, required: true }
});

export default mongoose.model<IData>('Data', DataSchema);
