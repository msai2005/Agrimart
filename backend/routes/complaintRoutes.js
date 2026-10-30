const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { submitComplaint, getComplaintStatus } = require('../controllers/complaintController');

const softAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (token && process.env.JWT_SECRET) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            // Guest submissions remain allowed
        }
    }
    next();
};

// @route   POST /api/complaints
// @desc    Submit a new complaint
// @access  Public/Private
router.post('/', softAuth, submitComplaint);

// @route   GET /api/complaints/status/:id
// @desc    Get status of a specific complaint
// @access  Public
router.get('/status/:id', getComplaintStatus);

module.exports = router;
