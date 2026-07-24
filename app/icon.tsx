import { ImageResponse } from "next/og";

export const contentType = "image/png";

// Mirrors components/brand/logo-mark.tsx
// Google requires at least a 48x48 square icon (recommends 96/144/192 too) to
// show a site's favicon in search results — see
// https://developers.google.com/search/docs/appearance/favicon-in-search
const ICONS = [
  { id: "48", size: 48 },
  { id: "96", size: 96 },
  { id: "192", size: 192 },
];

export function generateImageMetadata() {
  return ICONS.map(({ id, size }) => ({
    id,
    size: { width: size, height: size },
    contentType,
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id;
  const { size } = ICONS.find((icon) => icon.id === iconId) ?? ICONS[0];
  const glyph = Math.round((size * 27) / 32);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: Math.round((size * 7) / 32),
        }}
      >
        <svg width={glyph} height={glyph} viewBox="0 0 72 72">
          <path
            d="M40.17 59.64 A24 24 0 1 1 59.64 40.17"
            fill="none"
            stroke="#fa0707"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d="M64.56 41.04 L61.44 34.22 L56.2 43.35 Z" fill="#fa0707" />
          <path
            d="M33.74 23.2 A13 13 0 1 1 23.2 33.74"
            fill="none"
            stroke="#c7c9cc"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path d="M18.77 32.96 L23.21 30.31 L25 36 Z" fill="#c7c9cc" />
          <circle cx="36" cy="36" r="3.4" fill="#ffffff" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
