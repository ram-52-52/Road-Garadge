const twilio = require('twilio');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Twilio Strategy Initialization
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * GENERATE JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Initiate OTP Request via Twilio Verify
 * @route   POST /api/v1/auth/request-otp
 * @access  Public
 */
exports.requestOtp = async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Strategic phone identity required' });
  }

  try {
    // Prefix with +91 if needed (assuming India for this build)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const phoneDigits = phone.replace(/\D/g, '').slice(-10);

    console.log(`📡 OTP Request for: ${formattedPhone} (Digits: ${phoneDigits})`);

    // MASTER ADMIN OVERRIDE (Testing Node)
    const testNumbers = [
      '9999999999', '1234567890', '0987654321', '8888888888', '7777777777',
      '9999999901', '9999999902', '9999999903', '9999999904', '9999999905'
    ];
    if (testNumbers.includes(phoneDigits)) {
      console.log('🛡️ Master Bypass Triggered for Request');
      return res.status(200).json({
        success: true,
        message: 'Master Command Override. Tactical OTP Bypassed.',
        status: 'approved'
      });
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: formattedPhone, channel: 'sms' });

    res.status(200).json({
      success: true,
      message: 'OTP Handshake dispatched successfully',
      status: verification.status
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP & Issue Identity Token
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
exports.verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and Code artifacts required' });
  }

  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const phoneDigits = phone.replace(/\D/g, '').slice(-10);
    let user;

    // MASTER ADMIN OVERRIDE (Identity Finalization)
    const testNumbers = [
      '9999999999', '1234567890', '0987654321', '8888888888', '7777777777',
      '9999999901', '9999999902', '9999999903', '9999999904', '9999999905'
    ];
    
    if (testNumbers.includes(phoneDigits) && otp === '123456') {
      console.log(`🛡️ Master Bypass Triggered for Verification: ${phoneDigits}`);
      user = await User.findOne({ phone: phoneDigits });
      
      if (!user) {
        // Create skeleton if it doesn't exist (Only for legacy master numbers)
        const isLegacyMaster = ['9999999999', '1234567890'].includes(phoneDigits);
        user = await User.create({
          phone: phoneDigits,
          name: isLegacyMaster ? 'Supreme Commander' : `Test Account ${phoneDigits}`,
          role: isLegacyMaster ? 'ADMIN' : null,
          is_verified: true,
          onboarding_complete: isLegacyMaster
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          is_verified: user.is_verified,
          onboarding_complete: user.onboarding_complete,
          token: generateToken(user._id)
        }
      });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: formattedPhone, code: otp });

    if (verificationCheck.status !== 'approved') {
      return res.status(401).json({ success: false, message: 'Invalid or Expired OTP' });
    }

    // Identify/Create User Record
    // (phoneDigits is already declared above)
    user = await User.findOne({ phone: phoneDigits });

    if (!user) {
      // PHASE 0: New Identity Detected. Create with unassigned role.
      user = await User.create({
        phone: phoneDigits,
        role: null,
        is_verified: true,
        onboarding_complete: false
      });
    } else {
      user.is_verified = true;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        is_verified: user.is_verified,
        onboarding_complete: user.onboarding_complete,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Complete User Profile (Name & Role Selection)
 * @route   POST /api/v1/auth/complete-profile
 * @access  Private (JWT)
 */
exports.completeProfile = async (req, res, next) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ success: false, message: 'Strategic identity artifacts (Name & Role) required' });
  }

  if (!['DRIVER', 'GARAGE_OWNER'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role selection' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Identity not found' });
    }

    user.name = name;
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Identity artifacts finalized successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch Current Identity Payload
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Issue new JWT access token using refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
exports.refreshToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refresh_token !== refresh_token) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Issue fresh access token (short-lived)
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, data: { token: newAccessToken } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Invalidate session (logout)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refresh_token: null });
    res.status(200).json({ success: true, message: 'Session terminated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update FCM Token for Push Notifications
 * @route   PATCH /api/v1/auth/update-fcm
 * @access  Private
 */
exports.updateFcmToken = async (req, res, next) => {
  const { fcm_token } = req.body;
  if (!fcm_token) {
    return res.status(400).json({ success: false, message: 'FCM Token required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fcm_token = fcm_token;
    await user.save();

    res.status(200).json({ success: true, message: 'FCM Token updated successfully' });
  } catch (error) {
    next(error);
  }
};
