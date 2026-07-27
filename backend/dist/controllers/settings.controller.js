"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountRequest = exports.exportDataRequest = exports.logoutAllDevices = exports.updatePhone = exports.updateEmail = exports.updatePassword = exports.updateSettings = exports.getSettings = void 0;
const settingsService = __importStar(require("../services/settings.service"));
const getSettings = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        const settings = await settingsService.getStudentSettings(userId);
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        const { learning, notifications } = req.body;
        if (learning) {
            await settingsService.updateSettings(userId, 'learning', learning);
        }
        if (notifications) {
            await settingsService.updateSettings(userId, 'notifications', notifications);
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateSettings = updateSettings;
const updatePassword = async (req, res) => {
    try {
        // Mock success
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updatePassword = updatePassword;
const updateEmail = async (req, res) => {
    try {
        // Mock success
        res.json({ success: true, message: 'Email updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateEmail = updateEmail;
const updatePhone = async (req, res) => {
    try {
        // Mock success
        res.json({ success: true, message: 'Phone updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updatePhone = updatePhone;
const logoutAllDevices = async (req, res) => {
    try {
        const userId = req.user?.userId || 'mock';
        await settingsService.logoutAllDevices(userId);
        res.json({ success: true, message: 'Logged out from all other devices' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.logoutAllDevices = logoutAllDevices;
const exportDataRequest = async (req, res) => {
    try {
        res.json({ success: true, message: 'Data export request submitted. You will receive an email shortly.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.exportDataRequest = exportDataRequest;
const deleteAccountRequest = async (req, res) => {
    try {
        res.json({ success: true, message: 'Account deletion request submitted.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteAccountRequest = deleteAccountRequest;
