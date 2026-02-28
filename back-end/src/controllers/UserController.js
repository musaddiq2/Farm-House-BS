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

        // prevent login if account is blocked
        if (user.isActive === false) {
            return res.status(403).json({ message: "Account is blocked" });
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

// ----- Superadmin-only admin management -----

/**
 * @desc Create a new admin account
 * @route POST /api/superadmin/admins
 */
export const createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const admin = await User.create({
            firstName,
            lastName,
            email,
            password: hashed,
            phone,
            role: 'admin',
            isActive: true,
        });

        res.status(201).json({
            message: "Admin account created",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Get list of admin users
 * @route GET /api/superadmin/admins
 */
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.json({ count: admins.length, admins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Block an admin account
 * @route PUT /api/superadmin/admins/:id/block
 */
export const blockAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.isActive === false) {
            return res.status(400).json({ message: "Admin already blocked" });
        }
        admin.isActive = false;
        await admin.save();
        res.json({ message: "Admin blocked", admin: { id: admin._id, isActive: admin.isActive } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc Unblock an admin account
 * @route PUT /api/superadmin/admins/:id/unblock
 */
export const unblockAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.isActive === true) {
            return res.status(400).json({ message: "Admin already active" });
        }
        admin.isActive = true;
        await admin.save();
        res.json({ message: "Admin unblocked", admin: { id: admin._id, isActive: admin.isActive } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

