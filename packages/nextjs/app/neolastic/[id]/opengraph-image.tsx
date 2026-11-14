import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { generateSvg } from "@/lib/neolasticEvm";
import { shortenTokenId } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Neolastic";

const WALL = "#f9f8f5"; // --background
const INK = "#1c1a17"; // --foreground
const MUTED = "#5e5a55"; // --muted-foreground

// SFNewRepublic, as used for headings on the site. Falls back to the default font if it can't be read.
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public/fonts/SFNewRepublic.ttf"));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch (err) {
    console.error("[opengraph-image] font load failed:", err);
    return null;
  }
}

const FALLBACK_FILLS: string[] = Array(9).fill("#000000");

function parseFills(svg: string): string[] {
  const matches = [...svg.matchAll(/fill:(#[0-9a-fA-F]{6})/g)].map((m) => m[1]);
  return matches.length === 9 ? matches : FALLBACK_FILLS;
}

// Contract emits tiles in column-major order: (col 0 rows 0-2), (col 1 rows 0-2), (col 2 rows 0-2).
// Reorder to row-major for a CSS grid.
function toRowMajor(fills: string[]): string[] {
  const rows: string[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      rows.push(fills[col * 3 + row]);
    }
  }
  return rows;
}

export default async function OpengraphImage({ params }: { params: { id: string } }) {
  let fills: string[];
  try {
    const svg = await generateSvg(params.id);
    fills = toRowMajor(parseFills(svg));
  } catch (err) {
    console.error("[opengraph-image] generateSvg failed:", err);
    fills = FALLBACK_FILLS;
  }

  const font = await loadDisplayFont();
  const short = shortenTokenId(params.id);
  const tileSize = 160;
  const stroke = 3;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: WALL,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: `${stroke}px solid #000`,
          }}
        >
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ display: "flex", flexDirection: "row" }}>
              {[0, 1, 2].map((col) => (
                <div
                  key={col}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    background: fills[row * 3 + col],
                    borderRight: col < 2 ? `${stroke}px solid #000` : "none",
                    borderBottom: row < 2 ? `${stroke}px solid #000` : "none",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: INK,
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1, fontFamily: font ? "SFNewRepublic" : undefined }}>NEOLASTICS</div>
          <div style={{ fontSize: 30, color: MUTED, marginTop: 16 }}>{short}</div>
          <div style={{ fontSize: 24, color: MUTED, marginTop: 32, maxWidth: 460, lineHeight: 1.3 }}>
            On-chain generative neo-plastic art
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "SFNewRepublic", data: font, style: "normal" }] : undefined,
    },
  );
}
