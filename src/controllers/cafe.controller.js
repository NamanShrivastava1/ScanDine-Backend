const cafeModel = require('../models/cafe.model');
const menuModel = require('../models/menu.model');
const { validationResult } = require('express-validator');
const QRCode = require("qrcode");
module.exports.cafeInfo = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array(),
                message: "Validation failed"
            });
        }

        const { cafename, address, phoneNo, description } = req.body;

        if (!cafename || !address || !phoneNo) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const cafe = await cafeModel.create({
            cafename,
            address,
            phoneNo,
            description,
            user: req.user._id
        })

        res.status(201).json({
            message: "Cafe information added successfully",
            cafe
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.addMenuItems = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array(),
                message: "Validation failed"
            });
        }
        const { dishName, price, category, description } = req.body;

        if (!dishName || !price || !category) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const menu = await menuModel.create({
            dishName,
            price,
            category,
            description,
            cafe: req.cafe._id
        })

        res.status(201).json({
            message: "Menu item added successfully",
            menu
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.getMenuItemsByCafe = async (req, res) => {
    try {
        const { cafeId } = req.params;
        const menuItems = await menuModel.find({ cafe: cafeId });

        res.status(200).json({
            menuItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports.updateMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;

        if (!menuItemId) {
            return res.status(400).json({
                message: "Menu item ID is required"
            });
        }

        const { dishName, price, category, description } = req.body;

        if (!dishName && !price && !category && !description) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }

        const updateMenu = await menuModel.findByIdAndUpdate(menuItemId, {
            ...(dishName && { dishName }),
            ...(price && { price }),
            ...(category && { category }),
            ...(description && { description })
        },
            { new: true })

        if (!updateMenu) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item updated successfully",
            menu: updateMenu
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.deleteMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;

        if (!menuItemId) {
            return res.status(400).json({
                message: "Menu item ID is required"
            });
        }

        const deletedMenuItem = await menuModel.findByIdAndDelete(menuItemId);

        if (!deletedMenuItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            message: "Menu item deleted successfully",
            menu: deletedMenuItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports.generateQRCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const cafe = await cafeModel.findOne({ user: userId });

        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found for user" });
        }

        if (!cafe.qrCode) {
            const qrURL = `https://menuqr.site/api/dashboard/menu/${cafe._id}`;
            const qrImage = await QRCode.toDataURL(qrURL);
            cafe.qrCode = qrImage;
            await cafe.save();
        }

        res.status(200).json({
            message: "QR code ready",
            qrCode: cafe.qrCode,
            cafeId: cafe._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate QR",
            error: error.message,
        });
    }
};