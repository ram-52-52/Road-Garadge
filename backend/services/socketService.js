const User = require('../models/User');
const admin = require('../config/firebase');

/**
 * Socket.io & FCM Service
 * Handles all real-time broadcasts and push notifications
 */
class SocketService {
  /**
   * Register User's Socket ID
   */
  registerUser(userId, socketId, connectedUsers) {
    if (userId) {
      connectedUsers.set(userId.toString(), socketId);
      console.log(`✅ User ${userId} registered with socket ${socketId}`);
    }
  }

  /**
   * Unregister User's Socket ID
   */
  unregisterUser(socketId, connectedUsers) {
    for (let [userId, sId] of connectedUsers.entries()) {
      if (sId === socketId) {
        connectedUsers.delete(userId);
        console.log(`👋 User ${userId} disconnected`);
        break;
      }
    }
  }

  /**
   * Emit Event to Specific User
   */
  emitToUser(io, connectedUsers, userId, event, data) {
    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit(event, data);
      console.log(`📡 Socket Emit [${event}] -> User ${userId}`);
      return true;
    }
    return false;
  }

  /**
   * Send Push Notification via FCM
   */
  async sendPushNotification(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId).select('fcm_token');
      if (user && user.fcm_token) {
        const message = {
          notification: { title, body },
          data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
          token: user.fcm_token,
          android: { priority: 'high' }
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent push notification:', response);
      }
    } catch (error) {
      console.error('Error sending push notification:', error.message);
    }
  }

  /**
   * Handle New Job Dispatch
   */
  async handleNewJob(io, connectedUsers, job, nearbyGarages) {
    for (const garage of nearbyGarages) {
      // 1. Socket Alert (Instant)
      this.emitToUser(io, connectedUsers, garage.owner_id, 'job:new', { job });

      // 2. FCM Push Notification (Background Alert)
      await this.sendPushNotification(
        garage.owner_id,
        '🆘 New Rescue Request',
        `New ${job.service_type} search nearby! 🚗💨`,
        { jobId: job._id.toString(), type: 'NEW_JOB' }
      );
    }
  }

  /**
   * Handle Job Accepted
   */
  handleJobAccepted(io, connectedUsers, job) {
    this.emitToUser(io, connectedUsers, job.driver_id, 'job:accepted', { job });
    this.handleStatusUpdate(io, connectedUsers, job, 'ACCEPTED');
  }

  /**
   * Handle Status Update
   */
  handleStatusUpdate(io, connectedUsers, job, event) {
    const payload = { job, status: event };
    
    // Notify Driver
    this.emitToUser(io, connectedUsers, job.driver_id, 'job:status_update', payload);

    // Notify Mechanic (if assigned)
    if (job.garage_id) {
       // Since the request comes from the mechanic, we might or might not need to emit back to them 
       // but for consistency across multiple devices for the same user, we emit it.
       const mechanicId = job.garage_id.owner_id || job.garage_id;
       this.emitToUser(io, connectedUsers, mechanicId, 'job:status_update', payload);
    }
  }
}

module.exports = new SocketService();
