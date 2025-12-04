import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    history: [{
        flightId: String,
        origin: String,
        destination: String,
        date: Date,
        price: Number,
        bookedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
