import { useId } from 'react'

const sky = (uid, from, to) => (
  <defs>
    <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  </defs>
)

const bg = (uid) => <rect width="400" height="240" fill={`url(#${uid}-sky)`} />

function Beach({ uid }) {
  return (
    <>
      {sky(uid, '#ff9f7a', '#ffe6b8')}
      <defs>
        <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdc8" />
          <stop offset="1" stopColor="#0c7c9d" />
        </linearGradient>
      </defs>
      {bg(uid)}
      <circle cx="290" cy="105" r="36" fill="#fff4cf" opacity=".95" />
      <rect y="132" width="400" height="70" fill={`url(#${uid}-sea)`} />
      <path d="M20 150 q15 -8 30 0 t30 0 M140 165 q15 -8 30 0 t30 0 M250 148 q15 -8 30 0 t30 0"
            stroke="#fff" strokeWidth="2" fill="none" opacity=".6" />
      <path d="M0 196 Q110 168 250 190 T400 178 V240 H0Z" fill="#f6d9a0" />
      <path d="M92 205 Q100 150 114 108" stroke="#7b4a2b" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="#2f8f5b">
        <path d="M114 108 Q82 86 48 108 Q84 100 114 108Z" />
        <path d="M114 108 Q96 74 66 72 Q96 88 114 108Z" />
        <path d="M114 108 Q132 72 164 76 Q134 90 114 108Z" />
        <path d="M114 108 Q148 92 176 114 Q144 104 114 108Z" />
      </g>
    </>
  )
}

function Mountain({ uid }) {
  const pines = [34, 74, 118, 290, 332, 372]
  return (
    <>
      {sky(uid, '#8ec5ff', '#eaf5ff')}
      {bg(uid)}
      <circle cx="320" cy="62" r="22" fill="#fffbe6" opacity=".9" />
      <path d="M0 190 L90 82 L150 150 L220 58 L310 170 L360 118 L400 170 V240 H0Z" fill="#7a8fb8" />
      <path d="M90 82 L72 106 L90 100 L106 108Z M220 58 L196 92 L220 84 L240 94Z" fill="#fff" />
      <path d="M0 205 Q100 160 200 195 T400 185 V240 H0Z" fill="#3f7d5a" />
      <g fill="#245a3d">
        {pines.map((x, i) => (
          <g key={x}>
            <polygon points={`${x},${168 + (i % 2) * 6} ${x - 14},${205 + (i % 2) * 6} ${x + 14},${205 + (i % 2) * 6}`} />
            <polygon points={`${x},${150 + (i % 2) * 6} ${x - 11},${180 + (i % 2) * 6} ${x + 11},${180 + (i % 2) * 6}`} />
          </g>
        ))}
      </g>
    </>
  )
}

const BUILDINGS = [
  [10, 38, 90], [52, 30, 130], [86, 44, 100], [134, 34, 150], [172, 46, 110],
  [222, 32, 140], [258, 42, 95], [304, 36, 125], [344, 46, 85],
]

function City({ uid }) {
  return (
    <>
      {sky(uid, '#3a2b6e', '#f29a7b')}
      {bg(uid)}
      <circle cx="320" cy="58" r="22" fill="#fff2d0" />
      <g fill="#1d1838">
        {BUILDINGS.map(([x, w, h]) => <rect key={x} x={x} y={205 - h} width={w} height={h} />)}
      </g>
      <g fill="#ffd36b" opacity=".85">
        {BUILDINGS.flatMap(([x, w, h]) => {
          const dots = []
          for (let wy = 205 - h + 12; wy < 195; wy += 16) {
            for (let wx = x + 7; wx < x + w - 8; wx += 12) {
              if ((wx + wy) % 3 !== 0) dots.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width="5" height="7" />)
            }
          }
          return dots
        })}
      </g>
      <rect y="205" width="400" height="35" fill="#120f26" />
    </>
  )
}

function Lake({ uid }) {
  return (
    <>
      {sky(uid, '#ffd3a1', '#fff0dc')}
      <defs>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc0dc" />
          <stop offset="1" stopColor="#3b83b0" />
        </linearGradient>
      </defs>
      {bg(uid)}
      <circle cx="300" cy="96" r="30" fill="#ffe9b8" opacity=".9" />
      <path d="M0 132 L70 92 L130 122 L200 82 L280 127 L340 102 L400 132 V152 H0Z" fill="#c9a2c4" />
      <rect y="150" width="400" height="90" fill={`url(#${uid}-water)`} />
      <ellipse cx="300" cy="170" rx="40" ry="5" fill="#fff" opacity=".35" />
      <path d="M30 188 q15 -6 30 0 t30 0 M270 205 q15 -6 30 0 t30 0" stroke="#fff" strokeWidth="2" fill="none" opacity=".5" />
      <path d="M150 176 H250 L238 194 H162Z" fill="#6b4226" />
      <rect x="168" y="156" width="64" height="20" fill="#f2e3c6" />
      <path d="M162 156 H238 L228 144 H172Z" fill="#c0563b" />
      <rect x="180" y="162" width="10" height="9" fill="#7aa9c4" />
      <rect x="210" y="162" width="10" height="9" fill="#7aa9c4" />
      <g fill="#2f7d52">
        <ellipse cx="352" cy="150" rx="30" ry="15" />
        <ellipse cx="22" cy="152" rx="26" ry="13" />
      </g>
    </>
  )
}

function Desert({ uid }) {
  return (
    <>
      {sky(uid, '#ffc778', '#fff0d2')}
      {bg(uid)}
      <circle cx="110" cy="100" r="42" fill="#ffad42" opacity=".9" />
      <path d="M0 170 Q100 130 200 170 T400 160 V240 H0Z" fill="#eab76d" />
      <path d="M0 202 Q120 166 240 202 T400 196 V240 H0Z" fill="#d89a50" />
      <polygon points="270,205 310,150 350,205" fill="#9c3d2e" />
      <polygon points="300,205 310,178 320,205" fill="#3a1a14" />
      <g fill="#4f8f4a">
        <rect x="60" y="170" width="11" height="42" rx="5" />
        <rect x="47" y="180" width="10" height="5" rx="2" />
        <rect x="47" y="168" width="6" height="16" rx="3" />
        <rect x="74" y="186" width="10" height="5" rx="2" />
        <rect x="79" y="174" width="6" height="16" rx="3" />
      </g>
    </>
  )
}

function Forest({ uid }) {
  const trees = [[40, 205, 1], [95, 196, 0.8], [150, 208, 1.1], [250, 200, 0.9], [310, 210, 1.15], [365, 198, 0.85]]
  return (
    <>
      {sky(uid, '#cdeed3', '#f1faee')}
      {bg(uid)}
      <circle cx="320" cy="55" r="24" fill="#fffbe0" opacity=".9" />
      <path d="M0 160 Q100 110 220 150 T400 140 V240 H0Z" fill="#6fbf7f" />
      <path d="M0 202 Q120 164 260 198 T400 188 V240 H0Z" fill="#3f9b5a" />
      {trees.map(([x, y, s]) => (
        <g key={x}>
          <rect x={x - 3 * s} y={y - 26 * s} width={6 * s} height={26 * s} fill="#6b4a2d" />
          <circle cx={x} cy={y - 42 * s} r={22 * s} fill="#2c7f4a" />
          <circle cx={x - 12 * s} cy={y - 32 * s} r={14 * s} fill="#379257" />
          <circle cx={x + 12 * s} cy={y - 32 * s} r={14 * s} fill="#379257" />
        </g>
      ))}
    </>
  )
}

function Heritage({ uid }) {
  return (
    <>
      {sky(uid, '#ff9d7c', '#ffd9a8')}
      {bg(uid)}
      <circle cx="200" cy="112" r="52" fill="#ffe7b0" opacity=".6" />
      <rect x="110" y="130" width="180" height="74" fill="#c2593e" />
      <path d="M170 130 a30 30 0 0 1 60 0Z" fill="#a8452f" />
      <rect x="199" y="86" width="2" height="14" fill="#7b2f1f" />
      <rect x="92" y="112" width="22" height="92" fill="#b34d33" />
      <rect x="286" y="112" width="22" height="92" fill="#b34d33" />
      <path d="M92 112 a11 11 0 0 1 22 0Z M286 112 a11 11 0 0 1 22 0Z" fill="#8f3b27" />
      <g fill="#ffd9a8" opacity=".9">
        <rect x="126" y="150" width="14" height="26" rx="7" />
        <rect x="152" y="150" width="14" height="26" rx="7" />
        <rect x="234" y="150" width="14" height="26" rx="7" />
        <rect x="260" y="150" width="14" height="26" rx="7" />
      </g>
      <rect x="186" y="160" width="28" height="44" rx="14" fill="#5a2a1f" />
      <rect y="204" width="400" height="36" fill="#8a3f2e" />
    </>
  )
}

const ARTS = {
  beach: Beach, mountain: Mountain, city: City, lake: Lake,
  desert: Desert, forest: Forest, heritage: Heritage,
}

export default function Scene({ category = 'city', seed = 0, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const Art = ARTS[category] || City
  return (
    <svg
      className={`scene${seed % 2 ? ' flip' : ''} ${className}`}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${category} illustration`}
      style={{ filter: `hue-rotate(${(seed * 13) % 30}deg)` }}
    >
      <Art uid={uid} />
    </svg>
  )
}