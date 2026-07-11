// Phone mockup: the same capacity data over plain SMS, for feature phones and
// zero-connectivity areas. Content mirrors the live SMS simulator at /sms.

export function SMSMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[300px] ${className}`}>
      <div className="rounded-[2rem] border-[6px] border-slate-800 bg-slate-800 shadow-2xl">
        <div className="rounded-[1.6rem] bg-slate-100 p-3">
          {/* status bar */}
          <div className="flex items-center justify-between px-1 pb-2 text-[10px] font-medium text-slate-500">
            <span>1:52 AM</span>
            <span className="tracking-tight">MTN GH · No data · ▂▄▆</span>
          </div>
          <div className="rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 shadow-sm">
            SMS · Short code 1737
          </div>

          <div className="space-y-2 py-3">
            {/* outgoing */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand-green px-3 py-2 text-sm font-semibold text-white">
                BED ACCRA
              </div>
            </div>
            {/* incoming */}
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[13px] leading-relaxed text-slate-700 shadow-sm">
                <div className="font-semibold text-slate-900">3 nearby facilities:</div>
                <div className="mt-1 space-y-1">
                  <div><span className="font-semibold">1. Ridge Hospital:</span> <span className="text-emerald-600 font-semibold">Available</span>, 3 ICU</div>
                  <div><span className="font-semibold">2. 37 Military:</span> <span className="text-amber-600 font-semibold">Limited</span>, 2 ICU</div>
                  <div><span className="font-semibold">3. Korle Bu:</span> <span className="text-red-600 font-semibold">Full ICU</span>, avoid trauma</div>
                </div>
                <div className="mt-1.5 text-[11px] text-slate-400">Reply HELP for commands</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-slate-400 shadow-sm">
            Type a message…
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-500">
        Hospital updates accepted only from registered facility numbers.
      </p>
    </div>
  );
}
