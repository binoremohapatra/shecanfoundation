// Woman silhouette SVG — abstract profile facing right
// Used in Navbar (small) and Hero (large)
import React from 'react'

interface SilhouetteProps {
  className?: string
  fill?: string
  width?: number | string
  height?: number | string
}

export const WomanSilhouette: React.FC<SilhouetteProps> = ({
  className = '',
  fill = '#0D1B2A',
  width = 320,
  height = 380,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 380"
    width={width}
    height={height}
    className={className}
    aria-label="She Can Foundation — woman silhouette"
    role="img"
  >
    {/* Hair / head top */}
    <path
      fill={fill}
      d="
        M160 20
        C 110 20, 68 55, 62 100
        C 55 148, 70 170, 75 185
        C 60 190, 52 205, 55 225
        C 58 242, 72 250, 88 248
        C 92 268, 100 285, 112 298
        C 120 308, 130 315, 142 318
        L 142 360
        L 178 360
        L 178 318
        C 190 315, 200 308, 208 298
        C 220 285, 228 268, 232 248
        C 248 250, 262 242, 265 225
        C 268 205, 260 190, 245 185
        C 250 170, 265 148, 258 100
        C 252 55, 210 20, 160 20
        Z
      "
    />
    {/* Neck */}
    <rect x="142" y="310" width="36" height="28" rx="8" fill={fill} />
    {/* Shoulders / body */}
    <path
      fill={fill}
      d="
        M 80 360
        C 70 340, 60 325, 48 315
        C 30 302, 15 305, 10 320
        L 10 380
        L 310 380
        L 310 320
        C 305 305, 290 302, 272 315
        C 260 325, 250 340, 240 360
        Z
      "
    />
    {/* Hair detail — natural coils/curls on top */}
    <ellipse cx="130" cy="42" rx="22" ry="18" fill={fill} />
    <ellipse cx="160" cy="28" rx="26" ry="16" fill={fill} />
    <ellipse cx="192" cy="38" rx="20" ry="16" fill={fill} />
    <ellipse cx="210" cy="60" rx="18" ry="14" fill={fill} />
    <ellipse cx="110" cy="62" rx="16" ry="13" fill={fill} />
  </svg>
)

// Small mark version for navbar
export const LogoMark: React.FC<SilhouetteProps> = ({
  className = '',
  fill = '#E8452A',
  width = 36,
  height = 36,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={width}
    height={height}
    className={className}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="50" fill={fill} />
    <path
      fill="white"
      d="
        M50 12 C35 12,22 23,20 36 C17 52,23 62,25 69
        C18 72,14 79,16 90 C17.5 96,24 99,31 98
        C32 103,35 107,38 110 L38 130 L62 130
        L62 110 C65 107,68 103,69 98
        C76 99,82.5 96,84 90 C86 79,82 72,75 69
        C77 62,83 52,80 36 C78 23,65 12,50 12Z
      "
    />
    <ellipse cx="42" cy="20" rx="8" ry="6" fill="white" />
    <ellipse cx="50" cy="14" rx="9" ry="6" fill="white" />
    <ellipse cx="58" cy="18" rx="7" ry="6" fill="white" />
  </svg>
)
