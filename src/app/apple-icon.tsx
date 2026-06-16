import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #c44e14 0%, #9a3a0d 100%)",
          color: "white",
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span>Open</span>
          <span style={{ opacity: 0.92 }}>W</span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            opacity: 0.85,
          }}
        >
          DEMO
        </div>
      </div>
    ),
    { ...size },
  );
}
