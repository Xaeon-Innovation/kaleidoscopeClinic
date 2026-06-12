import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/site";

export const alt = `${SITE_NAME} — Specialist dentistry in Marylebone, London`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #022c22 0%, #1E433A 55%, #2d5a4a 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c9a962",
            marginBottom: 24,
          }}
        >
          Kaleidoscope Dental Specialists
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Specialist implant &amp; restorative dentistry
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          Marylebone · London W1
        </div>
      </div>
    ),
    { ...size }
  );
}
