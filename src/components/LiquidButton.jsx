import React from 'react'

function GlassFilter() {
  return (
    <svg className="d-none" aria-hidden="true">
      <defs>
        <filter
          id="container-glass"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export default function LiquidButton({ children, className = '', onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`liquid-btn ${className}`}
    >
      {/* Glass rim — the inset box-shadow stack creates the glass edge */}
      <span className="liquid-btn-rim" aria-hidden="true" />

      {/* Backdrop layer — applies SVG glass distortion to whatever is behind */}
      <span
        className="liquid-btn-backdrop"
        aria-hidden="true"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />

      {/* Content sits above both layers */}
      <span className="liquid-btn-content">
        {children}
      </span>

      <GlassFilter />
    </button>
  )
}
