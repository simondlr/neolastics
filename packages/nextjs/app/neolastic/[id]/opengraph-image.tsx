import { ImageResponse } from "next/og";
import { generateSvg } from "@/lib/neolasticEvm";
import { shortenTokenId } from "@/lib/format";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Neolastic";

export default async function OpengraphImage({ params }: { params: { id: string } }) {
  let svgDataUrl: string;
  try {
    const svg = await generateSvg(params.id);
    svgDataUrl = "data:image/svg+xml;base64," + Buffer.from(svg, "utf8").toString("base64");
  } catch {
    svgDataUrl = "data:image/svg+xml;base64," + Buffer.from(
      "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='#000'/></svg>",
      "utf8",
    ).toString("base64");
  }

  const short = shortenTokenId(params.id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          padding: "60px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={svgDataUrl} width={500} height={500} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#000",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>Neolastics</div>
          <div style={{ fontSize: 28, fontWeight: 400, color: "#666" }}>
            {short}
          </div>
          <div style={{ fontSize: 22, fontWeight: 400, color: "#666", marginTop: 24, maxWidth: 460 }}>
            On-chain generative neo-plastic art
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
