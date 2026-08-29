export function ElectricianAvatar() {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
      {/* vest */}
      <rect x="26" y="58" width="48" height="38" rx="16" fill="#0b2a57" />
      <rect x="26" y="58" width="48" height="11" rx="5.5" fill="#f8a821" />
      <rect x="45" y="58" width="10" height="38" fill="#f8a821" opacity="0.85" />

      {/* neck + head */}
      <rect x="44" y="50" width="12" height="10" rx="4" fill="#f4c28f" />
      <circle cx="50" cy="38" r="20" fill="#f4c28f" />
      <circle cx="30" cy="41" r="4" fill="#f4c28f" />
      <circle cx="70" cy="41" r="4" fill="#f4c28f" />

      {/* hard hat */}
      <path d="M27 35a23 23 0 0 1 46 0z" fill="#fbbf24" stroke="#c05700" strokeWidth="1.5" />
      <rect x="23" y="33" width="54" height="6" rx="3" fill="#f8a821" stroke="#c05700" strokeWidth="1" />
      <rect x="47" y="16" width="6" height="8" rx="2" fill="#ea6a00" />

      {/* face */}
      <circle cx="43" cy="39" r="2.3" fill="#1f2937" />
      <circle cx="57" cy="39" r="2.3" fill="#1f2937" />
      <path d="M42 47q8 6 16 0" stroke="#7c3f19" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="45" r="3" fill="#f19e59" opacity="0.55" />
      <circle cx="65" cy="45" r="3" fill="#f19e59" opacity="0.55" />

      {/* static arm */}
      <rect x="19" y="62" width="10" height="25" rx="5" fill="#f4c28f" />
      <rect x="17" y="83" width="14" height="8" rx="4" fill="#0b2a57" />

      {/* waving arm holding a wrench */}
      <g className="origin-[74px_62px] animate-wave">
        <rect x="70" y="42" width="9" height="25" rx="4.5" fill="#f4c28f" />
        <rect x="63" y="33" width="17" height="7" rx="3" fill="#94a3b8" stroke="#334155" strokeWidth="1" transform="rotate(-35 74 60)" />
        <circle cx="76" cy="40" r="4" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
      </g>
    </svg>
  );
}
