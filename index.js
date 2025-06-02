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

const UserModel = mongoose.model("users", userSchema)
app.get("/getUsers", async(req, res) => {
    const userData = await UserModel.find();
    res.json(userData);
});

app.use(express.json());
app.use('/auth', authRoutes);