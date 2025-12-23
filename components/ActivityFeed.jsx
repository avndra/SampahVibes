import { Sparkles, MessageSquare, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Icon from '@/components/Icon';
import { Badge } from '@/components/ui/badge';

export default function ActivityFeed({ activities, className = "" }) {
  if (!activities || activities.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-5xl mb-3 opacity-50">📭</div>
        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
          Belum Ada Aktivitas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mulai scan sampahmu untuk mendapatkan poin! 🚀
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex gap-1 items-center"><Clock className="w-3 h-3" /> Menunggu</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex gap-1 items-center"><CheckCircle className="w-3 h-3" /> Diproses</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 flex gap-1 items-center"><Truck className="w-3 h-3" /> Dikirim</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex gap-1 items-center"><CheckCircle className="w-3 h-3" /> Selesai</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex gap-1 items-center"><XCircle className="w-3 h-3" /> Ditolak</Badge>;
      default: return null;
    }
  };

  return (
    <div className={`overflow-y-auto pr-2 custom-scrollbar ${className}`}>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="group relative p-3 md:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">

              {/* Icon & Main Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`p-2 md:p-2.5 rounded-lg flex-shrink-0 mt-1 ${activity.type !== 'redeem'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                  {activity.type !== 'redeem' ? (
                    <Icon name="points_earned" size={18} className="md:w-5 md:h-5" />
                  ) : (
                    <Icon name="redeem" size={18} className="md:w-5 md:h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate">
                      {activity.type !== 'redeem' ? 'Poin Masuk' : 'Tukar Hadiah'}
                    </p>
                    {/* Show Status Badge only for Redeems */}
                    {activity.type === 'redeem' && activity.status && getStatusBadge(activity.status)}
                  </div>

                  {activity.description && !activity.productName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {activity.description}
                    </p>
                  )}
                  {activity.productName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                      {activity.productName}
                    </p>
                  )}

                  {/* Admin Note Display */}
                  {activity.adminNote && (
                    <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/30 text-xs text-blue-700 dark:text-blue-300 flex gap-2 items-start">
                      <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Admin:</span> {activity.adminNote}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>

              {/* Points Value */}
              <div className={`text-base md:text-lg font-black ml-2 whitespace-nowrap ${activity.type !== 'redeem'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-purple-600 dark:text-purple-400'
                }`}>
                {activity.type !== 'redeem' ? '+' : ''}{activity.points}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}