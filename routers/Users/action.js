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

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.query;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    // Validate input
    await check("fullName", "Full name is required")
        .optional()
        .notEmpty()
        .run(req);
    await check("email", "Email is not valid").optional().isEmail().run(req);
    await check("username", "Username is required")
        .optional()
        .notEmpty()
        .run(req);
    await check("password", "Password must be at least 6 characters long")
        .optional()
        .isLength({ min: 6 })
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.query;
        const updates = req.body;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.query;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const UserAction = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
