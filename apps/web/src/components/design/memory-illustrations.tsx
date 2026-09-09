import React from "react";
const P = {
  ink: "#896b50",
  paper: "#fff9ed",
  sage: "#b2bea1",
  deep: "#6e8462",
  coral: "#e99878",
  sand: "#ead8b8",
  gold: "#d4a15b",
};
export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 70" fill="none" aria-hidden="true">
      <path d="M31 62V32" stroke={P.deep} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 38Q29 10 57 7Q57 31 32 38Z" fill={P.coral} />
      <path d="M30 49Q9 49 6 27Q29 27 30 49Z" fill={P.sage} />
      <path
        d="M32 39Q40 23 50 15M30 49Q22 37 12 32"
        stroke={P.ink}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M24 3L26 11L33 13L26 15L24 22L22 15L15 13L22 11Z" fill={P.gold} />
    </svg>
  );
}
export function MemoryIllustration({
  kind,
  size = 64,
  className = "",
}: {
  kind: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={`memory-illustration ${className}`}
      style={
        {
          width: size,
          height: size,
          "--illustration-size": `${size}px`,
        } as React.CSSProperties
      }
      viewBox="0 0 200 180"
      fill="none"
      stroke={P.ink}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "Photo" ? (
        <>
          <g transform="rotate(9 139 67)">
            <rect x="108" y="21" width="62" height="81" rx="3" fill={P.paper} />
            <path d="M115 29H163V81H115Z" fill="#e1e6d4" />
            <circle cx="149" cy="43" r="7" fill={P.gold} stroke="none" />
            <path d="M116 77L130 56L143 72L152 61L163 77" fill={P.sage} stroke="none" />
          </g>
          <path
            d="M32 76Q32 68 41 68H60L70 55H100L112 68H142Q152 68 152 80V139Q152 150 141 150H42Q32 150 32 139Z"
            fill={P.paper}
          />
          <path d="M33 93H151V131H33" fill={P.sage} stroke="none" />
          <circle cx="94" cy="109" r="29" fill={P.sand} />
          <circle cx="94" cy="109" r="20" fill={P.deep} />
          <circle cx="94" cy="109" r="12" fill="#495d45" />
          <circle cx="89" cy="104" r="4" fill={P.paper} stroke="none" />
          <rect x="44" y="76" width="15" height="8" rx="2" fill={P.coral} />
        </>
      ) : kind === "Voice" ? (
        <>
          <path
            d="M45 75Q32 92 45 108M31 64Q10 91 31 119M159 75Q173 92 159 108M172 62Q194 92 172 120"
            stroke="#cdb18d"
          />
          <rect x="73" y="28" width="55" height="96" rx="27" fill={P.sage} />
          <rect x="80" y="35" width="41" height="68" rx="20" fill="#e0e5d4" />
          <path d="M88 49h24M86 61h28M86 73h28M88 85h24" stroke="#8c9a79" />
          <path d="M61 93v13a40 40 0 0 0 80 0V93M101 147v15" strokeWidth="3" />
          <path d="M79 163H124" strokeWidth="4" />
          <path d="M138 33Q153 40 149 55Q134 50 138 33Z" fill={P.coral} />
        </>
      ) : kind === "Video" ? (
        <>
          <g transform="rotate(-8 100 92)">
            <rect x="33" y="58" width="137" height="95" rx="8" fill={P.paper} />
            <path d="M33 59L166 34L172 57L37 83Z" fill={P.sage} />
            <path
              d="M48 57l13 19M80 51l13 19M112 45l13 19M144 39l13 19"
              stroke={P.paper}
              strokeWidth="10"
            />
            <path d="M46 138L69 111L94 137L121 106L156 138" fill="#e1e6d4" stroke="none" />
            <circle cx="139" cy="97" r="8" fill={P.gold} stroke="none" />
            <circle cx="98" cy="111" r="23" fill={P.coral} />
            <path d="M92 99L109 111L92 122Z" fill={P.paper} stroke="none" />
          </g>
        </>
      ) : kind === "Milestone" ? (
        <>
          <path d="M54 151V39" strokeWidth="3" />
          <path
            d="M55 40Q80 22 108 40Q134 59 161 37V96Q136 114 109 95Q82 78 55 96Z"
            fill={P.sand}
          />
          <path
            d="M108 43L115 59L132 61L119 73L123 90L108 81L93 90L96 73L83 61L101 59Z"
            fill={P.coral}
          />
          <path d="M37 156Q65 146 91 157M112 154Q139 143 166 155" stroke="#b7bd9a" />
          <path d="M161 144Q153 122 171 111Q179 133 161 144M158 155l4-18" fill={P.sage} />
        </>
      ) : kind === "Letter" ? (
        <>
          <path d="M29 82L100 38L173 82V147Q173 155 164 155H39Q29 155 29 146Z" fill={P.sand} />
          <g transform="rotate(-7 99 81)">
            <rect x="54" y="23" width="94" height="110" rx="3" fill={P.paper} />
            <path d="M68 44H127M68 56H132M68 68H119M68 80H127" stroke="#baa17d" />
            <path
              d="M88 97Q95 87 101 97Q107 87 114 96Q118 105 101 116Q86 107 88 97"
              fill={P.coral}
            />
          </g>
          <path d="M29 82L101 128L173 82V147Q173 155 164 155H39Q29 155 29 146Z" fill="#f5e4cc" />
          <path d="M31 147L79 114M171 147L123 114" />
          <path d="M166 116L181 52L188 54L174 120L166 130Z" fill={P.sage} />
        </>
      ) : kind === "Keepsake" ? (
        <>
          <g transform="rotate(-6 100 92)">
            <rect x="36" y="66" width="130" height="84" rx="8" fill={P.sage} />
            <path d="M30 57Q30 51 37 51H166Q174 51 174 58V78H30Z" fill="#d8dfc8" />
            <path d="M91 51H110V151H91Z" fill={P.sand} />
            <path
              d="M100 50Q62 42 70 26Q81 11 101 48Q118 14 133 28Q142 44 100 50Z"
              fill={P.coral}
            />
            <rect x="119" y="91" width="34" height="25" rx="3" fill={P.paper} />
            <path d="M127 101h18M127 108h11" stroke="#bda584" />
          </g>
          <path d="M23 145Q14 129 17 117Q36 126 23 145M24 155l-3-15" fill={P.sage} />
        </>
      ) : (
        <>
          <path
            d="M27 47Q60 31 100 54Q139 31 175 47V143Q137 128 100 151Q62 129 27 143Z"
            fill={P.sand}
          />
          <path
            d="M32 39Q67 27 100 48Q134 28 170 39V134Q133 123 100 144Q66 123 32 134Z"
            fill={P.paper}
          />
          <path d="M100 49v94M115 58h37M115 70h32M115 82h36M115 94h29M45 119h39" stroke="#b49a76" />
          <circle cx="64" cy="65" r="12" fill={P.gold} stroke="none" />
          <path d="M43 106L60 82L71 97L82 88L92 107" fill={P.sage} stroke="none" />
          <path d="M139 125v31l10-7 10 7v-32" fill={P.coral} />
        </>
      )}
      <path d="M24 35l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill={P.gold} stroke="none" />
      <path d="M178 139l2 5 5 2-5 1-2 6-1-6-6-1 6-2Z" fill={P.gold} stroke="none" />
    </svg>
  );
}
