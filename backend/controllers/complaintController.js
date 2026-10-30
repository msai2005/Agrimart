const Complaint = require('../models/complaintModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Public/Private
exports.submitComplaint = async (req, res) => {
    try {
        const { orderId, category, subject, description, email } = req.body;

        // Never trust a client-supplied userId. Use the logged-in user, or look up by email.
        let userRef = req.user?.id || null;
        if (!userRef && email) {
            const user = await User.findOne({ email });
            if (user) userRef = user._id;
        }

        // Validate required fields based on the model
        if (!category || !subject || !description) {
            return res.status(400).json({ message: "Category, subject and description are required." });
        }

        const complaint = new Complaint({
            user: userRef || "000000000000000000000000", // Placeholder if guest
            order: orderId || null,
            category,
            subject,
            description,
            status: 'Open',
            priority: 'Medium'
        });

        await complaint.save();

        res.status(201).json({
            message: "Complaint submitted successfully.",
            complaintId: complaint._id
        });
    } catch (error) {
        console.error("Submit Complaint Error:", error);
        res.status(500).json({ message: "Failed to submit complaint." });
    }
};

// @desc    Get complaint status
// @route   GET /api/complaints/status/:id
// @access  Public
exports.getComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('order', 'trackingStatus createdAt');

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        res.json({
            id: complaint._id,
            status: complaint.status,
            category: complaint.category,
            createdAt: complaint.createdAt,
            resolution: complaint.resolution
        });
    } catch (error) {
        console.error("Get Complaint Status Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};
