import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Register new user
 * @route POST /api/users/register
 */
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        
        
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });

        // 4. Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Login user
 * @route POST /api/users/login
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Get logged-in user profile
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/profile
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.profilePicture = req.body.profilePicture || user.profilePicture;

        const updatedUser = await user.save();

        res.json({
            message: "Profile updated",
            user: updatedUser,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
