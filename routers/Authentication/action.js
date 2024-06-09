import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../DB/Model/User.js";

const loginUser = async (req, res) => {
    // Validate input
    await check("email", "Email is required").notEmpty().run(req);
    await check("password", "Password is required").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProfile = async (req, res) => {
    try {
        // Extract the JWT token from the request headers
        const token = req.headers.authorization.split(" ")[1];

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the user ID from the decoded token payload
        const userId = decodedToken.userId;

        // Fetch user data from the database using the user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        // Return the user data in the response
        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Attach the user ID to the request object
        req.userId = decodedToken.userId;
        next();
    });
};

export const AuthAction = {
    loginUser,
    getProfile,
    authenticateToken
};
