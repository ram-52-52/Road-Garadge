import { create } from 'zustand';
import { socket } from '../services/socket';

interface Job {
  _id: string;
  services: string[];
  service_type?: string; // legacy field — modal compat
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
  garage_id?: string | { name: string; location: any };
}

interface JobState {
  activeJob: Job | null;
  incomingJob: Job | null;
  isOnline: boolean;
  initSocket: (userId: string) => void;
  setIncomingJob: (job: Job | null) => void;
  setActiveJob: (job: Job | null) => void;
  setOnlineStatus: (status: boolean) => void;
  fetchActiveJob: () => Promise<void>;
  disconnectSocket: () => void;
}

/**
 * MISSION-CRITICAL JOB STORE: Real-Time Dispatch Pipeline
 * Orchestrates Socket.io handshakes and tactical job states.
 */
export const useJobStore = create<JobState>((set) => ({
  socket: null,
  activeJob: null,
  incomingJob: null,
  isOnline: false,

  initSocket: (userId: string) => {
    if (socket.connected) return;

    socket.connect();

    socket.on('connect', () => {
      console.log('⚡ High-Precision Socket Uplink Established:', socket.id);
      socket.emit('register', { userId });
    });

    // Real-Time Event Handlers
    socket.on('job:new', (data: { job: Job }) => {
      console.log('🚨 Incoming Rescue Mission:', data.job);
      set({ incomingJob: data.job });
    });

    socket.on('job:accepted', (data: { job: Job }) => {
      console.log('✅ Mission Handshake Confirmed:', data.job);
      set({ activeJob: data.job, incomingJob: null });
    });
    
    socket.on('job:status_update', (data: { job: Job; status?: string; event?: string }) => {
      const status = data.status || data.event;
      console.log(`📡 Mission Status Adjusted: ${status}`, data.job);
      set({ activeJob: data.job });
    });

    socket.on('mechanic:location', (data: { jobId: string; coordinates: [number, number] }) => {
       console.log('📍 Live GPS Uplink Received:', data.coordinates);
    });
  },

  setIncomingJob: (job) => set({ incomingJob: job }),
  setActiveJob: (job) => set({ activeJob: job }),
  setOnlineStatus: (status) => set({ isOnline: status }),

  fetchActiveJob: async () => {
    try {
      const axios = (await import('axios')).default;
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const jobs = response.data.data;
      
      // Filter for actionable statuses
      const candidates = jobs.filter((j: any) => ['PENDING', 'ACCEPTED', 'EN_ROUTE'].includes(j.status));
      
      // Prioritize: EN_ROUTE > ACCEPTED > PENDING
      const priority: Record<string, number> = { 'EN_ROUTE': 0, 'ACCEPTED': 1, 'PENDING': 2 };
      candidates.sort((a: any, b: any) => priority[a.status] - priority[b.status]);

      // If it's just PENDING, check if it's very old (e.g. > 1 hour) - simple version
      const now = new Date();
      const active = candidates.find((j: any) => {
        if (j.status !== 'PENDING') return true;
        const created = new Date(j.createdAt);
        return (now.getTime() - created.getTime()) < 3600000; // 1 hour threshold
      });

      set({ activeJob: active || null });
    } catch (err) {
      console.error('Fetch Active Job Failure', err);
    }
  },

  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
      console.log('👋 Socket Downlink Terminated');
    }
  },
}));
