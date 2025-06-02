import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
});
const UserModel = mongoose.model("endpoint_logic", userSchema);

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '1d' }
    );
    res.json({ token });
});

// Register endpoint
router.post('/register', async (req, res) => {
    const { name, age, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Name, email, and password required' });

    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, age, email, password: hashed });
    await user.save();
    res.json({ message: 'User registered' });
});

export default router;