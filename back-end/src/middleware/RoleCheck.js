import User from "../models/Users.js";

export const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'superadmin') {
            return res.status(403).json({ message: "Access denied. SuperAdmin required." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            return res.status(403).json({ message: "Access denied. Admin required." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};