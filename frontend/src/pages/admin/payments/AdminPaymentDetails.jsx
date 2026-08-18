import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, Mail, Phone, BookOpen, Tag, CreditCard, DollarSign, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";
const AdminPaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const [paymentRes, invoiceRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/payments/${id}`),
          axios.get(`http://localhost:5000/api/admin/payments/${id}/invoice`)
        ]);
        setPayment(paymentRes.data.data);
        setInvoice(invoiceRes.data.data);
      } catch (err) {
        toast.error("Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [id]);
  const downloadInvoice = () => {
    toast.success("Invoice downloaded successfully");
  };
  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>;
  }
  if (!payment) return null;
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center gap-4">
        <button
    onClick={() => navigate("/admin/payments")}
    className="p-2 text-caption hover:text-heading hover:bg-gray-100 rounded-xl transition-colors"
  >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading flex items-center gap-3">
            Payment Details
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${payment.status === "Paid" ? "bg-emerald-50 text-emerald-700" : payment.status === "Pending" ? "bg-yellow-50 text-yellow-700" : payment.status === "Failed" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}>
              {payment.status}
            </span>
          </h1>
          <p className="text-body text-sm mt-1">
            Transaction ID: <span className="font-mono text-heading font-medium">{payment.transactionId}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Student Info Card */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm h-full hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-heading text-lg">Student</h3>
              <p className="text-xs text-caption font-medium uppercase tracking-wider">Purchaser Info</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Name</div>
              <div className="font-medium text-heading">{payment.studentName}</div>
            </div>
            <div className="flex items-center gap-3 text-body">
              <Mail className="w-4 h-4 text-caption shrink-0" />
              <span className="truncate">{payment.studentEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-body">
              <Phone className="w-4 h-4 text-caption shrink-0" />
              <span>{payment.studentPhone}</span>
            </div>
          </div>
        </div>

        {
    /* Course Info Card */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm h-full hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-heading text-lg">Course</h3>
              <p className="text-xs text-caption font-medium uppercase tracking-wider">Purchased Item</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold text-caption uppercase tracking-wider mb-1">Course Name</div>
              <div className="font-medium text-heading">{payment.courseName}</div>
            </div>
            <div className="flex items-center gap-3 text-body">
              <User className="w-4 h-4 text-caption shrink-0" />
              <span>Instructor: <span className="text-heading font-medium">{payment.instructorName}</span></span>
            </div>
            <div className="flex items-center gap-3 text-body">
              <Tag className="w-4 h-4 text-caption shrink-0" />
              <span>{payment.category}</span>
            </div>
          </div>
        </div>

        {
    /* Payment Summary Card */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm h-full hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-heading text-lg">Payment</h3>
              <p className="text-xs text-caption font-medium uppercase tracking-wider">Financial Details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-caption">Original Amount</span>
              <span className="font-medium text-heading">₹{payment.amount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-caption">Discount</span>
              <span className="font-medium text-emerald-600">- ₹{payment.discount}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-border/50 pt-3">
              <span className="font-bold text-heading">Final Amount</span>
              <span className="font-black font-heading text-lg text-primary">₹{payment.finalAmount}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-caption mt-4 pt-4 border-t border-border/50">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Paid via <strong className="text-heading">{payment.paymentMethod}</strong> ({payment.paymentGateway})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
    /* Invoice Card */
  }
        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-heading text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Invoice Details
            </h3>
            {invoice && <button
    onClick={downloadInvoice}
    className="px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
  >
                <Download className="w-4 h-4" /> Download PDF
              </button>}
          </div>
          
          {invoice ? <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-caption font-bold uppercase tracking-wider mb-1">Invoice Number</div>
                  <div className="font-mono text-heading font-medium">{invoice.invoiceNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-caption font-bold uppercase tracking-wider mb-1">Date</div>
                  <div className="text-heading font-medium">{new Date(invoice.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-caption font-bold uppercase tracking-wider mb-2">Tax Breakdown</div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-body">Subtotal</span>
                  <span className="font-medium text-heading">₹{invoice.subtotal - invoice.discount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-body">GST (18%)</span>
                  <span className="font-medium text-heading">₹{invoice.tax}</span>
                </div>
              </div>
            </div> : <div className="text-center py-8 text-caption">No invoice generated for this payment.</div>}
        </div>
      </div>
    </div>;
};
var stdin_default = AdminPaymentDetails;
export {
  stdin_default as default
};
