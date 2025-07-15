const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array(),
                message: "Validation failed"
            });
        }

        const { fullname, email, mobile, password } = req.body;

        if (!fullname || !email || !mobile || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const isUserExists = await userModel.findOne({ email })
        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userModel.create({
            fullname,
            email,
            mobile,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array(),
                message: "Validation failed"
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            token
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: "Logged out successfully" });
}

module.exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}