import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../constants/apiConstants';

interface Job {
  _id: string;
  service_type: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  status: 'PENDING' | 'ACCEPTED' | 'EN_ROUTE' | 'COMPLETED' | 'CANCELLED';
  driver_id: {
    name: string;
    phone: string;
  };
}

interface JobState {
  socket: Socket | null;
  activeJob: Job | null;
  incomingJob: Job | null;
  initSocket: (userId: string) => void;
  setIncomingJob: (job: Job | null) => void;
  setActiveJob: (job: Job | null) => void;
  disconnectSocket: () => void;
}

/**
 * MISSION-CRITICAL JOB STORE: Real-Time Dispatch Pipeline
 * Orchestrates Socket.io handshakes and tactical job states.
 */
export const useJobStore = create<JobState>((set, get) => ({
  socket: null,
  activeJob: null,
  incomingJob: null,

  initSocket: (userId: string) => {
    if (get().socket) return;

    // Tactical WebSocket Uplink
    const socket = io(BASE_URL.replace('/api/v1', ''), {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('⚡ High-Precision Socket Uplink Established:', socket.id);
      socket.emit('register', { userId });
    });

    // Real-Time Event Handlers
    socket.on('job:new', (data: { job: Job }) => {
      console.log('🚨 Incoming Rescue Mission:', data.job);
      set({ incomingJob: data.job });
    });

    socket.on('job:status_update', (data: { job: Job; event: string }) => {
      console.log(`📡 Mission Status Adjusted: ${data.event}`, data.job);
      set({ activeJob: data.job });
    });

    socket.on('mechanic:location', (data: { jobId: string; coordinates: [number, number] }) => {
       console.log('📍 Live GPS Uplink Received:', data.coordinates);
       // This can be consumed by the Tracking HUD in the Driver app
    });

    set({ socket });
  },

  setIncomingJob: (job) => set({ incomingJob: job }),
  setActiveJob: (job) => set({ activeJob: job }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log('👋 Socket Downlink Terminated');
    }
  },
}));
