/**
 * Breakpoint values in pixels
 * Based on common device widths
 */
export const BREAKPOINTS = {
  mobile: 480,      // Small phones (iPhone SE, etc.)
  tablet: 768,      // Tablets and large phones
  desktop: 1024,    // Desktop and laptops
  wide: 1200        // Large desktops
} as const;

/**
 * Media query strings for use with useMediaQuery hook
 */
export const MEDIA_QUERIES = {
  // Mobile-first (max-width)
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,

  // Desktop-first (min-width)
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `(min-width: ${BREAKPOINTS.wide}px)`,

  // Range queries
  tabletOnly: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  desktopOnly: `(min-width: ${BREAKPOINTS.tablet + 1}px) and (max-width: ${BREAKPOINTS.desktop}px)`
} as const;

/**
 * Responsive spacing values
 */
export const SPACING = {
  mobile: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  desktop: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
} as const;

/**
 * Responsive font sizes
 */
export const FONT_SIZES = {
  mobile: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px'
  },
  desktop: {
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '24px',
    xxl: '32px'
  }
} as const;

/**
 * Touch target minimum size (44x44px per iOS/Android guidelines)
 */
export const TOUCH_TARGET = {
  minHeight: '44px',
  minWidth: '44px'
} as const;
