const Message = require('../models/Message');

// @desc    Get chat history for a specific job
// @route   GET /api/v1/chat/:jobId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Fetch messages for the job, sorted by timestamp
    const messages = await Message.find({ jobId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name role')
      .populate('recipient', 'name role');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getChatHistory
};
