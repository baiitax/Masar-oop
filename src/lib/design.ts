// MASAR Glassmorphism Design System

export const colors = {
  navy: '#0B1F3A',
  navyLight: '#102A4C',
  gold: '#C9A24A',
  goldLight: '#E3C875',
  bg: '#F6F8FB',
  white: '#FFFFFF',
  text: '#142235',
  textSec: '#667085',
  textMuted: '#98A2B3',
  border: '#E4E7EC',
  borderLight: '#F3F4F6',
  green: '#16A34A',
  greenLight: '#F0FDF4',
  red: '#EF4444',
  redLight: '#FEF2F2',
  amber: '#F59E0B',
  amberLight: '#FFFBEB',
  blue: '#3B82F6',
  blueLight: '#EFF6FF',
  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',
};

export const glass = {
  // Main glass card
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  // Dark glass
  dark: {
    background: 'rgba(11, 31, 58, 0.92)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(201, 162, 74, 0.15)',
    borderRadius: '12px',
  },
  // Sidebar
  sidebar: {
    background: 'rgba(11, 31, 58, 0.95)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRight: '1px solid rgba(201, 162, 74, 0.1)',
  },
  // Input
  input: {
    background: 'rgba(249, 250, 251, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid #E4E7EC',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
  },
  // Button primary (gold)
  btnPrimary: {
    background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)',
    color: '#0B1F3A',
    borderRadius: '10px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(201, 162, 74, 0.25)',
  },
  // Button secondary (navy)
  btnSecondary: {
    background: '#0B1F3A',
    color: 'white',
    borderRadius: '10px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // Button outline
  btnOutline: {
    background: 'white',
    color: '#667085',
    borderRadius: '10px',
    fontWeight: 500,
    border: '1px solid #E4E7EC',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Button danger
  btnDanger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    borderRadius: '10px',
    fontWeight: 500,
    border: '1px solid rgba(239, 68, 68, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Badge
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
  },
  // Metric card
  metric: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #E4E7EC',
    padding: '16px',
    transition: 'all 0.2s ease',
  },
  // Table
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    padding: '10px 14px',
    textAlign: 'left' as const,
    fontSize: '10px',
    fontWeight: 700,
    color: '#98A2B3',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #E4E7EC',
    background: '#F9FAFB',
  },
  tableCell: {
    padding: '12px 14px',
    fontSize: '13px',
    color: '#142235',
    borderBottom: '1px solid #E4E7EC',
  },
};

export function getBadgeStyle(type: 'success' | 'warning' | 'danger' | 'info' | 'neutral') {
  const styles = {
    success: { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' },
    warning: { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
    danger: { background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' },
    info: { background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' },
    neutral: { background: '#F9FAFB', color: '#667085', border: '1px solid #E4E7EC' },
  };
  return { ...glass.badge, ...styles[type] };
}

export const animations = {
  fadeIn: { animation: 'fadeIn 0.5s ease-out forwards' },
  slideUp: { animation: 'slideUp 0.4s ease-out forwards' },
  float: { animation: 'float 3s ease-in-out infinite' },
  pulse: { animation: 'pulse 2s infinite' },
  spin: { animation: 'spin 1s linear infinite' },
};

export const typography = {
  h1: { fontSize: '22px', fontWeight: 800, color: colors.text, lineHeight: 1.2 },
  h2: { fontSize: '18px', fontWeight: 700, color: colors.text, lineHeight: 1.3 },
  h3: { fontSize: '15px', fontWeight: 700, color: colors.text, lineHeight: 1.4 },
  body: { fontSize: '14px', color: colors.text, lineHeight: 1.6 },
  small: { fontSize: '13px', color: colors.textSec, lineHeight: 1.5 },
  tiny: { fontSize: '11px', color: colors.textMuted },
  label: { fontSize: '10px', fontWeight: 600, color: colors.textMuted, letterSpacing: '0.05em' },
  mono: { fontFamily: 'monospace', fontSize: '12px' },
};
