import { ArrowLeft, ChevronRight, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServiceDrawer({ service, onClose }) {
  if (!service) return null;

  return (
    <aside
      className="fixed top-0 right-0 h-full w-full md:w-[480px] z-30 bg-[#170F25]/90 backdrop-blur-2xl border-l border-white/10 p-6 sm:p-8 pt-24 sm:pt-24 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out overflow-y-auto"
      aria-label="Service Details Drawer"
    >
      <div>
        {/* Navigation Back Button */}
        <button
          onClick={onClose}
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C084FC] hover:text-white transition-colors duration-200 mb-8 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#F472B6]/40 cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HUB</span>
        </button>

        {/* Category Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F472B6]">
            {service.category || '✦ SERVICE MODULE'}
          </span>
        </div>

        {/* Service Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-4 bg-gradient-to-r from-white via-[#F3E8FF] to-[#C084FC] bg-clip-text text-transparent">
          {service.title}
        </h2>

        {/* Tagline / Description */}
        <p className="text-sm text-[#C084FC]/90 leading-relaxed font-sans mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
          {service.tagline}
        </p>

        {/* Dynamic Capability List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#A855F7]" />
              Core Capabilities
            </span>
            <span className="text-[10px] font-mono text-[#F472B6]">
              {service.items.length} MODULES
            </span>
          </div>

          <div className="space-y-2">
            {service.items.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-3 rounded-xl bg-[#30204A]/50 border border-white/10 hover:border-[#A855F7]/50 hover:bg-[#402660]/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#F472B6] shrink-0" />
                  <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[#C084FC]/40 group-hover:text-[#F472B6] group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glowing CTA Button */}
      <div className="pt-8 mt-6 border-t border-white/10">
        <button
          onClick={() => alert(`Inquiring about ${service.title}...`)}
          className="w-full py-4 rounded-xl font-mono font-bold text-xs tracking-widest uppercase text-white bg-gradient-to-r from-[#542548] via-[#402660] to-[#A855F7] border border-[#F472B6]/40 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_45px_rgba(244,114,182,0.8)] hover:brightness-110 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>EXPLORE SERVICE</span>
          <ArrowRight size={15} className="text-[#F472B6]" />
        </button>
      </div>
    </aside>
  );
}
