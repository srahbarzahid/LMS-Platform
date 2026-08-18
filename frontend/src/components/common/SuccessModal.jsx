import { Check, ArrowRight } from "lucide-react";
const SuccessModal = ({ isOpen, title, message, onContinue }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md relative overflow-hidden transform scale-100 opacity-100 transition-all duration-300 border border-gray-100">
        
        {
    /* Decorative Background Pattern */
  }
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-50 to-white">
          <div
    className="absolute inset-0 opacity-[0.15]"
    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #10B981 1px, transparent 0)", backgroundSize: "16px 16px" }}
  />
        </div>

        <div className="p-8 pt-10 text-center flex flex-col items-center relative z-10">
          
          {
    /* Icon Container with Concentric Rings */
  }
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20" />
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-white shadow-sm relative z-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <Check className="w-7 h-7 text-white stroke-[3]" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-heading font-black text-heading mb-3">{title}</h2>
          <p className="text-body text-sm mb-8 leading-relaxed px-4">
            {message}
          </p>
          
          <button
    onClick={onContinue}
    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
  >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
};
var stdin_default = SuccessModal;
export {
  stdin_default as default
};
