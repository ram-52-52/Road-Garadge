const User = require('../models/User');
const Notification = require('../models/Notification');
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
    const idString = userId?._id ? userId._id.toString() : userId?.toString();
    const socketId = connectedUsers.get(idString);
    
    if (socketId) {
      io.to(socketId).emit(event, data);
      console.log(`📡 Socket Emit [${event}] -> User ${idString}`);
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
    const servicesText = job.services.join(', ');
    
    for (const garage of nearbyGarages) {
      const ownerId = garage.owner_id._id || garage.owner_id;

      // 1. Persist to Database for History Archive
      await Notification.create({
        userId: ownerId,
        title: '🆘 New Rescue Request',
        body: `New ${servicesText} mission nearby! 🚗💨`,
        type: 'JOB',
        data: { services: job.services, jobId: job._id }
      });

      // 2. Socket Alert (Instant)
      this.emitToUser(io, connectedUsers, ownerId, 'job:new', { job });

      // 3. FCM Push Notification (Background Alert)
      await this.sendPushNotification(
        ownerId,
        '🆘 New Rescue Request',
        `Multiple services requested: ${servicesText}`,
        { jobId: job._id.toString(), type: 'NEW_JOB' }
      );
    }
  }

  /**
   * Handle Job Accepted
   */
  async handleJobAccepted(io, connectedUsers, job) {
    const driverId = job.driver_id._id || job.driver_id;

    await Notification.create({
      userId: driverId,
      title: '✅ Request Accepted',
      body: `A mechanic is en route for your ${job.services.join(', ')} request!`,
      type: 'JOB'
    });

    this.emitToUser(io, connectedUsers, driverId, 'job:accepted', { job });
    this.handleStatusUpdate(io, connectedUsers, job, 'ACCEPTED');
  }

  /**
   * Handle Status Update
   */
  async handleStatusUpdate(io, connectedUsers, job, event) {
    // Strategic Data Handshake: Ensure driver ALWAYS sees mechanic details in status updates
    const populatedJob = await job.populate([
      { path: 'driver_id', select: 'name phone' },
      { path: 'garage_id', select: 'name location owner_id' }
    ]);

    const payload = { job: populatedJob, status: event };
    const driverId = populatedJob.driver_id._id || populatedJob.driver_id;
    
    // Notify Driver
    this.emitToUser(io, connectedUsers, driverId, 'job:status_update', payload);

    // Notify Mechanic (if assigned)
    if (populatedJob.garage_id) {
       const mechanicId = populatedJob.garage_id.owner_id || populatedJob.garage_id;
       this.emitToUser(io, connectedUsers, mechanicId, 'job:status_update', payload);

       // Save to DB for Driver
       if (event !== 'ACCEPTED') { 
         await Notification.create({
           userId: driverId,
           title: '📊 Mission Status Update',
           body: `Your request status changed to: ${event}`,
           type: 'JOB'
         });
       }
    }
  }
}

module.exports = new SocketService();
