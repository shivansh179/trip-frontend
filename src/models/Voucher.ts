import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVoucher extends Document {
  code: string;
  amount: number;
  validUntil: Date;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  purchasedBy: { name: string; email: string; phone: string };
  usedFor?: string;
  usedAt?: Date;
  createdBy: 'admin' | 'client';
  txnid?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    code:       { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount:     { type: Number, required: true, min: 100 },
    validUntil: { type: Date, required: true },
    status:     { type: String, enum: ['active', 'used', 'expired', 'cancelled'], default: 'active' },
    purchasedBy: {
      name:  { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true, default: '' },
    },
    usedFor:   { type: String },
    usedAt:    { type: Date },
    createdBy: { type: String, enum: ['admin', 'client'], default: 'admin' },
    txnid:     { type: String },
    note:      { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

VoucherSchema.index({ code: 1 });
VoucherSchema.index({ status: 1, createdAt: -1 });
VoucherSchema.index({ 'purchasedBy.email': 1 });

const Voucher: Model<IVoucher> =
  mongoose.models.Voucher ?? mongoose.model<IVoucher>('Voucher', VoucherSchema);

export default Voucher;
