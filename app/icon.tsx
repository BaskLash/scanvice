import { ImageResponse } from 'next/og'

// Exportiere die Bildgrösse und den Typ
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#E0E7FF', // Entspricht etwa deinem bg-primary/10
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#4F46E5', // Deine primary Farbe
        }}
      >
        {/* Das ScanLine Icon nachgebaut als SVG-Pfad */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M3 17v2a2 2 0 0 0 2 2h2" />
          <line x1="7" x2="17" y1="12" y2="12" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
