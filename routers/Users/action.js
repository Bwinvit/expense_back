import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../../DB/Model/User.js";

const createUser = async (req, res) => {
    // Validate input
    await check("fullName", "Full name is required").notEmpty().run(req);
    await check("email", "Email is not valid").isEmail().run(req);
    await check("username", "Username is required").notEmpty().run(req);
    await check("password", "Password must be at least 6 characters long")
        .isLength({ min: 6 })
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, username, password } = req.body;

        // Check if the email or username already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Email or username already exists" });
        }

        // Create a new user
        const newUser = new User({ fullName, email, username, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const UserAction = {
    createUser,
};
