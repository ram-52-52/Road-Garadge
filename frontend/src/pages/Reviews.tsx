import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Star, 
  User, 
  Wrench, 
  Quote, 
  Loader2, 
  MessageSquare,
  ShieldCheck,
  Award,
  CircleDot
} from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 w-fit">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          fill={star <= rating ? 'currentColor' : 'none'}
          className={star <= rating ? 'text-amber-400 opacity-100 shadow-xl shadow-amber-500/20' : 'text-slate-600 opacity-20'}
          strokeWidth={3}
        />
      ))}
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data.data || []);
      } catch (error) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Moderation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
             <ShieldCheck size={14} strokeWidth={3} />
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Service Integrity</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Quality Moderation</h1>
          <p className="text-slate-500 font-medium italic italic italic">Auditing marketplace feedback and trust indices.</p>
        </div>
        <div className="flex items-center gap-6 bg-slate-900 px-8 py-4 rounded-[2rem] border border-white/5 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          <Award size={24} className="text-blue-500 relative z-10" strokeWidth={2.5} />
          <div className="relative z-10">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Total Testimonials</p>
            <p className="text-xl font-black text-white italic tracking-tighter italic">{reviews.length} Verified Entries</p>
          </div>
        </div>
      </div>

      {/* Review Feed */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-32 text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" strokeWidth={2.5} />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Reputation Protocols...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
              <CircleDot size={40} className="text-slate-200 animate-pulse" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Feedback Zero-State</h3>
            <p className="text-slate-400 mt-2 font-medium">As soon as marketplace cycles complete, results will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-slate-100/50">
            {reviews.map((review) => (
              <div key={review._id} className="p-12 hover:bg-slate-500/5 transition duration-700 group relative">
                <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                  {/* Entity Metadata */}
                  <div className="w-full lg:w-72 shrink-0 space-y-6">
                    <div className="flex items-center gap-4 group/user">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs border border-slate-800 shadow-xl group-hover/user:scale-110 transition-transform">
                        <User size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 tracking-tight group-hover/user:text-blue-600 transition-colors uppercase">{review.driver_name || 'Driver'}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Consumer Member</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group/garage">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white border border-blue-500 shadow-xl shadow-blue-500/20 group-hover/garage:scale-110 transition-transform">
                        <Wrench size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-700 tracking-tight italic group-hover/garage:text-blue-600 transition-colors uppercase">{review.garage_name || 'Service Partner'}</p>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Marketplace Partner</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Core */}
                  <div className="flex-1 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <StarRating rating={review.rating} />
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100/60">
                         <MessageSquare size={14} className="text-slate-400" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="relative p-10 bg-slate-100/50 rounded-[2.5rem] border border-slate-100 transition duration-700 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-900/5 group-hover:-translate-y-2">
                      <Quote className="text-blue-500 opacity-5 absolute top-8 left-8" size={80} strokeWidth={3} />
                      <p className="text-slate-600 font-bold text-lg leading-relaxed italic italic relative z-10 tracking-tight">"{review.comment}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
