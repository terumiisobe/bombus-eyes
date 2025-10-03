import React from 'react';

// Centralized styles for the app
export const COLORS: Record<string, string> = {
  primary: '#8B4513',
  background: '#FFFFFF',
  lightYellow: '#FFFACD',
  lightYellowBorder: '#F0E68C',
  warningBlue: '#E6F3FF',
  warningBlueBorder: '#B3D9FF',
  warningBlueText: '#0066CC',
  white: '#FFFFFF'
};

export const FONT_SIZES: Record<string, string> = {
  heading: 'inherit', // Keep original heading size
  input: '24px',
  button: '24px',
  icon: '24px',
  body: '20px',
  label: '22px',
  warning: '18px',
  loading: '22px',
  qrInstructions: '18px'
};

export const SPACING: Record<string, string> = {
  small: '10px',
  medium: '15px',
  large: '20px',
  xlarge: '25px'
};

export const BORDER_RADIUS: Record<string, string> = {
  small: '4px',
  medium: '6px',
  large: '10px'
};

export const BORDER_WIDTH: Record<string, string> = {
  thin: '1px',
  medium: '2px'
};

// Component-specific styles
export const containerStyle = {
  backgroundColor: COLORS.background,
  minHeight: '100vh',
  padding: SPACING.large
};

export const headingStyle: React.CSSProperties = {
  color: COLORS.primary,
  textAlign: 'center' as const,
  marginBottom: SPACING.large
};

export const developmentModeStyle: React.CSSProperties = {
  backgroundColor: COLORS.warningBlue,
  color: COLORS.warningBlueText,
  padding: SPACING.medium,
  margin: `${SPACING.small} 0`,
  borderRadius: BORDER_RADIUS.small,
  border: `${BORDER_WIDTH.thin} solid ${COLORS.warningBlueBorder}`,
  textAlign: 'center' as const,
  fontSize: FONT_SIZES.warning,
  fontWeight: '500'
};

export const offlineWarningStyle = {
  backgroundColor: COLORS.lightYellow,
  color: COLORS.primary,
  padding: SPACING.medium,
  margin: `${SPACING.small} 0`,
  borderRadius: BORDER_RADIUS.small,
  border: `${BORDER_WIDTH.thin} solid ${COLORS.lightYellowBorder}`,
  fontSize: FONT_SIZES.warning,
  fontWeight: '500'
};

export const searchContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row' as const,
  gap: SPACING.small,
  marginBottom: SPACING.xlarge,
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${SPACING.large}`
};

export const inputStyle: React.CSSProperties = {
  padding: `${SPACING.medium} ${SPACING.large}`,
  fontSize: FONT_SIZES.input,
  border: `${BORDER_WIDTH.medium} solid ${COLORS.primary}`,
  borderRadius: BORDER_RADIUS.medium,
  width: '100%',
  maxWidth: '400px',
  boxSizing: 'border-box' as const,
  textAlign: 'center' as const,
  color: COLORS.primary,
  backgroundColor: COLORS.background,
  fontWeight: '500'
};

export const cameraButtonStyle: React.CSSProperties = {
  padding: SPACING.medium,
  fontSize: FONT_SIZES.button,
  backgroundColor: COLORS.primary,
  color: COLORS.white,
  border: `${BORDER_WIDTH.medium} solid ${COLORS.primary}`,
  borderRadius: BORDER_RADIUS.medium,
  cursor: 'pointer',
  width: '60px',
  height: '60px',
  boxSizing: 'border-box' as const,
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '60px'
};

export const qrContainerStyle: React.CSSProperties = {
  marginBottom: SPACING.xlarge,
  textAlign: 'center' as const
};

export const qrInstructionsStyle = {
  marginTop: SPACING.medium,
  color: COLORS.primary,
  fontSize: FONT_SIZES.qrInstructions,
  fontWeight: '500'
};

export const loadingStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: SPACING.xlarge,
  color: COLORS.primary,
  fontSize: FONT_SIZES.loading,
  fontWeight: '500'
};

export const resultContainerStyle = {
  padding: `0 ${SPACING.large}`
};

export const resultBoxStyle = {
  border: `${BORDER_WIDTH.medium} solid ${COLORS.lightYellowBorder}`,
  borderRadius: BORDER_RADIUS.large,
  padding: SPACING.xlarge,
  marginBottom: SPACING.large,
  backgroundColor: COLORS.lightYellow,
  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  color: COLORS.primary
};

export const resultItemStyle = {
  marginBottom: SPACING.medium,
  fontSize: FONT_SIZES.body,
  lineHeight: '1.4'
};

export const resultLabelStyle = {
  fontSize: FONT_SIZES.label
};

export const resultValueStyle = {
  fontSize: FONT_SIZES.body
};

export const noResultsStyle: React.CSSProperties = {
  color: COLORS.primary,
  textAlign: 'center' as const,
  fontSize: FONT_SIZES.body,
  fontWeight: '500',
  padding: SPACING.large
}; 