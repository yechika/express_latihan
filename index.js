import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }   );
})
.catch((error)=>console.log(error));

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
});

const UserModel = mongoose.model("endpoint_logics", userSchema)
app.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({}, 'name age');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.use(express.json());
app.use('/auth', authRoutes);