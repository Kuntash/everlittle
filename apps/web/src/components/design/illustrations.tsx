// Purpose-drawn editorial scenes. Small action icons remain in Shared.tsx.
const C = {
  line: "#896b50",
  paper: "#fff9ed",
  peach: "#f7c9a8",
  coral: "#e78666",
  sage: "#aab598",
  deep: "#637d5a",
  sand: "#e6d4ad",
};
function Leaves() {
  return (
    <g className="scene-leaves" fill={C.sage} stroke={C.line} strokeWidth="1.4">
      <path d="M42 159Q23 143 24 120Q44 122 42 159Z" />
      <path d="M44 162Q52 140 68 142Q66 159 44 162Z" />
      <path d="M44 174Q43 145 29 129" fill="none" />
      <path d="M194 161Q211 137 223 141Q219 161 194 161Z" />
      <path d="M194 160Q180 141 184 125Q202 134 194 160Z" />
      <path d="M190 177Q196 154 215 148" fill="none" />
    </g>
  );
}
function Spark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      className="scene-spark"
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-8Q1-1 7 0Q1 1 0 8Q-1 1-7 0Q-1-1 0-8Z"
      fill="#dda965"
      stroke="none"
    />
  );
}
function Face({
  x,
  y,
  scale = 1,
  elder = false,
  child = false,
}: {
  x: number;
  y: number;
  scale?: number;
  elder?: boolean;
  child?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-27 27Q-28-24 0-25Q28-22 28 28" fill={elder ? "#d4c8b4" : "#806d56"} />
      <ellipse cy="6" rx="23" ry="29" fill="#f4d6b5" />
      <path
        d={child ? "M-23-4Q-7-24 5-11Q14-14 24-1" : "M-24-5Q-13-31 4-18Q12-10 23-5"}
        fill={elder ? "#d4c8b4" : "#806d56"}
      />
      <path
        d="M-10 6h1M9 6h1M-6 19Q0 23 7 18"
        stroke={C.line}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {elder && (
        <g fill="none">
          <rect x="-18" y="0" width="15" height="11" rx="5" />
          <rect x="3" y="0" width="15" height="11" rx="5" />
          <path d="M-3 5H3" />
        </g>
      )}
    </g>
  );
}
export function Illustration({ scene, className = "" }: { scene: string; className?: string }) {
  return (
    <svg
      className={`illustration illustration-${scene} ${className}`}
      viewBox="0 0 240 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      stroke={C.line}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M35 107C23 67 67 32 116 32C160 14 216 57 209 109C226 151 176 177 122 173C65 185 23 155 35 107Z"
        fill={scene === "privacy" || scene === "voice" ? "#e9ecd9" : "#fff0df"}
        stroke="none"
      />
      <ellipse cx="122" cy="171" rx="78" ry="8" fill="#e3ceb2" opacity=".38" stroke="none" />
      {scene === "privacy" ? (
        <>
          <Leaves />
          <g className="scene-main">
            <path
              d="M120 28Q141 47 171 47L168 105Q163 139 120 162Q77 139 72 105L69 47Q100 47 120 28Z"
              fill={C.paper}
            />
            <path
              d="M120 40Q140 55 159 57L156 103Q151 128 120 148Q89 129 84 103L81 57Q103 54 120 40Z"
              fill="#f5dfb8"
            />
            <rect x="98" y="87" width="45" height="39" rx="8" fill={C.sand} />
            <path d="M108 87V77a12 12 0 0 1 24 0V87" strokeWidth="3" />
            <circle cx="120" cy="103" r="3" fill={C.line} />
            <path d="M120 105v9" strokeWidth="3" />
          </g>
          <Spark x={190} y={52} />
          <Spark x={50} y={84} s={0.7} />
        </>
      ) : scene === "family" ? (
        <>
          <Leaves />
          <g className="scene-main">
            <path d="M42 151Q45 109 80 109Q107 114 108 153" fill={C.sage} />
            <Face x={77} y={79} scale={1.02} elder />
            <path d="M130 153Q129 109 165 108Q194 112 199 155" fill={C.peach} />
            <Face x={165} y={77} scale={1.04} elder />
            <path d="M85 172Q83 137 119 132Q151 138 153 172" fill="#e8bd83" />
            <Face x={119} y={114} scale={0.78} child />
            <path
              d="M59 147Q80 165 101 161M180 148Q156 166 138 161"
              strokeWidth="7"
              stroke="#d8bfa1"
            />
          </g>
          <Spark x={121} y={33} />
        </>
      ) : scene === "baby" ? (
        <>
          <g className="scene-main" transform="rotate(-7 120 100)">
            <rect x="57" y="31" width="130" height="142" rx="9" fill={C.sand} />
            <rect x="65" y="26" width="130" height="142" rx="9" fill={C.paper} />
            <path d="M82 26V168" stroke="#d9bb92" />
            <circle cx="133" cy="86" r="37" fill="#f9dfbd" />
            <path d="M101 91Q97 61 130 57Q163 57 166 91" fill="#ecd1af" />
            <path d="M130 57Q112 42 128 40Q140 43 130 53" />
            <path d="M118 85h1M145 85h1M126 102Q133 108 140 101" strokeWidth="2.6" />
            <path d="M107 129Q131 115 155 129" />
            <path d="M103 144H162M113 152h39" stroke="#bfaa86" />
          </g>
          <Spark x={43} y={59} />
          <Spark x={203} y={114} s={0.7} />
        </>
      ) : scene === "letter" ? (
        <>
          <g className="scene-main">
            <path d="M49 90L120 43L191 90V157Q191 165 181 165H59Q49 165 49 155Z" fill={C.peach} />
            <g className="scene-page" transform="rotate(-7 119 94)">
              <rect x="72" y="31" width="96" height="117" rx="3" fill={C.paper} />
              <path d="M87 53h49M87 64h64M87 75h58M87 86h65M87 98h37" stroke="#b69b76" />
              <path
                d="M126 119Q134 106 138 116Q145 108 148 117Q148 124 138 130Z"
                fill={C.coral}
                stroke="none"
              />
            </g>
            <path d="M49 90L119 135L191 90V159Q191 166 181 166H60Q49 166 49 157Z" fill="#f6dfbf" />
            <path d="M49 158L100 123M191 158L140 123" />
            <path d="M187 134L212 65L217 68L195 140L187 147Z" fill={C.sage} />
            <path d="M187 147L195 140" />
          </g>
          <Spark x={42} y={53} />
          <Spark x={192} y={31} s={0.65} />
        </>
      ) : scene === "voice" ? (
        <>
          <Leaves />
          <g className="scene-main">
            <rect x="95" y="43" width="52" height="90" rx="25" fill={C.sage} />
            <rect x="102" y="48" width="38" height="65" rx="18" fill="#d5dbc5" />
            <path d="M109 62h24M108 72h26M108 82h26M110 92h22" stroke="#91a181" />
            <path d="M83 99v12a38 38 0 0 0 76 0V99M121 149v17" strokeWidth="4" />
            <path d="M103 168H139" strokeWidth="5" />
            <path
              d="M64 72Q49 87 64 102M52 59Q27 84 52 116M178 72Q192 87 178 102"
              stroke="#c99a73"
            />
            <path
              d="M176 34Q172 50 188 52Q170 64 161 51Q153 37 176 34Z"
              fill="#e8c27f"
              stroke="none"
            />
          </g>
          <Spark x={63} y={39} s={0.65} />
        </>
      ) : scene === "sprout" ? (
        <>
          <g className="scene-main">
            <path d="M42 168Q67 140 97 165Q126 133 156 157Q183 147 207 170" fill={C.sand} />
            <path d="M120 161V85Q119 67 135 48" stroke={C.deep} strokeWidth="3" />
            <path
              className="scene-leaf"
              d="M125 102Q120 45 175 34Q183 88 125 102Z"
              fill={C.coral}
            />
            <path d="M127 93Q145 64 166 46" stroke="#ba7554" />
            <path className="scene-leaf" d="M119 121Q71 125 66 80Q112 75 119 121Z" fill={C.sage} />
            <path d="M117 117Q94 97 75 88" stroke="#778962" />
            <path
              d="M55 166v-24M55 150Q41 148 39 136Q57 134 55 150M182 166v-14M182 158Q194 145 203 148Q199 164 182 158"
              fill={C.sage}
            />
          </g>
          <Spark x={59} y={53} />
          <Spark x={190} y={109} />
          <circle cx="108" cy="38" r="5" fill={C.peach} stroke="none" />
        </>
      ) : scene === "capture" || scene === "Photo" ? (
        <>
          <g className="scene-main">
            <g transform="rotate(12 154 79)">
              <path d="M120 25H190V115H120Z" fill={C.paper} />
              <path d="M129 34H181V91H129Z" fill="#d7dec4" />
              <circle cx="164" cy="52" r="10" fill="#f1c681" stroke="none" />
              <path d="M129 84L145 61L159 81L169 67L181 86" fill={C.sage} stroke="none" />
            </g>
            <path
              d="M51 83Q51 75 61 75H83L94 62H121L132 75H159Q170 75 170 86V151Q170 160 158 160H62Q51 160 51 149Z"
              fill={C.paper}
            />
            <path d="M51 104H170V144H51Z" fill={C.sage} stroke="none" />
            <circle cx="112" cy="117" r="32" fill="#f1dcc0" />
            <circle cx="112" cy="117" r="23" fill="#71816a" />
            <circle cx="112" cy="117" r="15" fill="#435144" />
            <circle cx="107" cy="111" r="5" fill="#bfcbb3" stroke="none" />
            <rect x="64" y="84" width="16" height="9" rx="3" fill={C.peach} />
            <path d="M74 70H83" strokeWidth="6" />
          </g>
          <Spark x={37} y={63} />
          <Spark x={198} y={133} />
        </>
      ) : scene === "Milestone" ? (
        <>
          <Leaves />
          <g className="scene-main">
            <path d="M84 161V47" strokeWidth="3" />
            <path
              d="M85 46Q114 28 145 50Q166 64 188 43V100Q163 117 141 99Q111 80 85 102Z"
              fill={C.peach}
            />
            <path
              d="M133 56L139 71L154 73L143 84L145 98L132 91L119 98L121 83L111 73L127 71Z"
              fill="#e7b15c"
            />
            <path d="M74 163h32" strokeWidth="4" />
            <circle cx="51" cy="66" r="4" fill={C.sage} />
          </g>
          <Spark x={189} y={130} />
          <Spark x={113} y={23} />
        </>
      ) : scene === "Video" ? (
        <>
          <g className="scene-main">
            <rect x="51" y="49" width="142" height="112" rx="9" fill={C.paper} />
            <path d="M51 49H193V77H51Z" fill={C.sage} />
            <path
              d="M70 49L58 77M101 49L89 77M132 49L120 77M163 49L151 77M190 49L179 77"
              stroke={C.paper}
              strokeWidth="12"
            />
            <path d="M65 143L99 102L126 134L149 112L181 143" fill="#dce3cc" stroke="none" />
            <circle cx="161" cy="96" r="10" fill={C.peach} stroke="none" />
            <circle cx="121" cy="118" r="23" fill={C.coral} />
            <path d="M116 108L131 118L116 128Z" fill={C.paper} stroke="none" />
          </g>
          <Spark x={35} y={99} />
          <Spark x={204} y={32} />
        </>
      ) : (
        <>
          <Leaves />
          <g className="scene-main">
            <path
              d="M48 60Q81 42 120 66Q159 42 193 59V151Q153 137 120 160Q86 139 48 151Z"
              fill={C.sand}
            />
            <path
              d="M52 51Q84 38 120 60Q156 38 189 51V143Q151 131 120 153Q84 131 52 143Z"
              fill={C.paper}
            />
            <path d="M120 60v93" />
            <path d="M66 113Q77 79 105 89V122Z" fill={C.sage} stroke="none" />
            <circle cx="89" cy="71" r="9" fill={C.peach} stroke="none" />
            <path d="M138 69h34M137 81h38M137 94h33M137 107h36M66 132h39" stroke="#b99d7c" />
            <path d="M160 138v24l9-7 9 7v-26" fill={C.coral} />
          </g>
          <Spark x={201} y={44} />
        </>
      )}
    </svg>
  );
}
