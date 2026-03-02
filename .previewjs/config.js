// .previewjs/config.js
import { defineConfig } from '@previewjs/config';

export default defineConfig({
  alias: {
    '@': './',
  },
  wrapper: {
    path: 'preview-wrapper.tsx',
    componentName: 'PreviewWrapper',
  },
});