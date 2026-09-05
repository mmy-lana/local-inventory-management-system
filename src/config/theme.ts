import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

export const enterpriseTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#0958d9',
    colorInfo: '#0958d9',
    colorSuccess: '#389e0d',
    colorWarning: '#d46b08',
    colorError: '#cf1322',
    colorTextBase: '#141414',
    colorBgBase: '#ffffff',
    borderRadius: 2,
    fontSize: 13,
    fontSizeSM: 12,
    lineHeight: 1.45,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    controlHeight: 28,
    controlHeightSM: 24,
    controlHeightLG: 32,
    paddingSM: 8,
    padding: 12,
    marginSM: 8,
    margin: 12,
  },
  components: {
    Table: {
      cellPaddingBlockSM: 4,
      cellPaddingInlineSM: 8,
      cellPaddingBlock: 6,
      cellPaddingInline: 10,
      fontSize: 12,
      headerBg: '#fafafa',
      headerColor: '#434343',
      borderColor: '#f0f0f0',
      rowHoverBg: '#f5f5f5',
    },
    Tag: {
      fontSize: 11,
      lineHeight: 1.3,
      borderRadiusSM: 2,
    },
    Button: {
      paddingInlineSM: 8,
      controlHeightSM: 24,
      borderRadius: 2,
      fontSize: 12,
    },
    Input: {
      controlHeight: 28,
      controlHeightSM: 24,
      borderRadius: 2,
      fontSize: 12,
      paddingInlineSM: 6,
    },
    Select: {
      controlHeight: 28,
      controlHeightSM: 24,
      fontSize: 12,
    },
    Badge: {
      fontSize: 11,
      dotSize: 6,
    },
    Typography: {
      titleMarginBottom: 4,
      titleMarginTop: 0,
    },
    Modal: {
      borderRadiusLG: 4,
      paddingContentHorizontalLG: 16,
      paddingMD: 16,
    },
  },
};