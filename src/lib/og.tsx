import { ImageResponse } from 'takumi-js/response';

// Brand ink (T10) background, primary blue tones for text, and the accent red as the identity bar.
const og = { background: '#001d32', title: '#e7f2ff', description: '#b0c9e7', site: '#94ccff', brand: '#d61d41' };

export function generateOGImage({ title, description, site }: { title: string; description?: string; site: string; format?: 'webp' }) {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 64, backgroundColor: og.background, color: og.title, borderBottom: `12px solid ${og.brand}` }}>
      <p style={{ margin: 0, fontSize: 76, fontWeight: 600 }}>{title}</p>
      {description && <p style={{ marginTop: 24, fontSize: 40, color: og.description }}>{description}</p>}
      <p style={{ marginTop: 'auto', marginBottom: 0, fontSize: 32, color: og.site }}>{site}</p>
    </div>,
    { width: 1200, height: 630, format: 'webp' },
  );
}
