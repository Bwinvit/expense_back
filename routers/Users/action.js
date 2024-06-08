import User from "../../DB/Model/User.js";

const createUser = async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;
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
