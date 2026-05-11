export const MIME_TYPE = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  WEBP: 'image/webp',
  PNG: 'image/png',
} as const satisfies Record<string, string>;

export const IMAGES_MIME_TYPES = Object.values(MIME_TYPE);
