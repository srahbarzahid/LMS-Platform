import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Tag, Calendar, Activity, CheckCircle, XCircle, 
  Clock, IndianRupee, Users, TrendingDown, Info
} from 'lucide-react';

interface OfferUsage {
  id: string;
  studentName: string;
  courseName: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  paymentId: string;
  usedDate: string;
}

interface Offer {
  id: string;
  name: string;
  code: string;
  offerType: string;
  discountType: string;
  discountValue: number;
  applicableType: string;
  targetName: string;
  minimumPurchaseAmount: number | null;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  usagePerStudent: number | null;
  startDate: string;
  endDate: string;
  status: string;
  usageHistory: OfferUsage[];
}

export default function AdminOfferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/admin/offers/${id}`);
      if (response.data.success) {
        setOffer(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching offer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Expired': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Active': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case 'Scheduled': return <Clock className="w-4 h-4 mr-1.5" />;
      case 'Expired': return <XCircle className="w-4 h-4 mr-1.5" />;
      default: return <Info className="w-4 h-4 mr-1.5" />;
    }
  };

  if (loading || !offer) {
    return <div className="p-8 text-center text-gray-500">Loading offer details...</div>;
  }

  const revenueGenerated = offer.usageHistory.reduce((sum, usage) => sum + usage.finalAmount, 0);
  const totalDiscountGiven = offer.usageHistory.reduce((sum, usage) => sum + usage.discountAmount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/offers')}
          className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-lg border border-border shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{offer.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(offer.status)}`}>
              {getStatusIcon(offer.status)}
              {offer.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span>{offer.offerType}</span>
            {offer.code && (
              <>
                <span>•</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 border border-gray-200">
                  {offer.code}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <div className="text-3xl font-heading font-black text-gray-900">{offer.usedCount}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Times Used</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-3xl font-heading font-black text-gray-900">₹{revenueGenerated.toLocaleString()}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Revenue Generated</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="text-3xl font-heading font-black text-gray-900">₹{totalDiscountGiven.toLocaleString()}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Discount Given</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offer Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                Configuration
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Discount</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-medium">Applicable To</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{offer.applicableType}: {offer.targetName}</p>
              </div>

              {offer.minimumPurchaseAmount && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Minimum Purchase</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">₹{offer.minimumPurchaseAmount}</p>
                </div>
              )}

              {offer.maximumDiscountAmount && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Maximum Discount</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">₹{offer.maximumDiscountAmount}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-gray-500 font-medium mb-2">Usage Limits</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Usage</span>
                  <span className="font-semibold text-gray-900">{offer.usedCount} / {offer.usageLimit || 'Unlimited'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-gray-500 font-medium mb-2">Validity Period</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{new Date(offer.startDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>{new Date(offer.endDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-border bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Usage History
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {offer.usageHistory.length} Records
              </span>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-border sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student & Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {offer.usageHistory.length > 0 ? (
                    offer.usageHistory.map((usage) => (
                      <tr key={usage.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{usage.studentName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{usage.courseName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm">
                            <span className="text-gray-500 line-through">₹{usage.originalPrice}</span>
                            <span className="font-semibold text-gray-900 flex items-center gap-1">
                              ₹{usage.finalAmount}
                              <span className="text-xs text-emerald-600 bg-emerald-50 px-1 rounded">
                                -₹{usage.discountAmount}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {usage.paymentId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(usage.usedDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No usage history found for this offer yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
