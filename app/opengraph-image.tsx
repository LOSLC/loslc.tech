import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LOSL-C | Linux & Open Source Lovers Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#111111",
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120px",
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          <span style={{ color: "#0066ff", marginRight: "20px" }}>&gt;_</span>
          LOSL-C
        </div>
        <p
          style={{
            fontSize: "40px",
            color: "#a1a1aa", // text-muted-foreground
            lineHeight: 1.4,
            maxWidth: "800px",
            margin: 0,
          }}
        >
          Linux & Open Source Lovers Community.
        </p>
        <p
          style={{
            fontSize: "24px",
            color: "#0066ff",
            marginTop: "40px",
            fontFamily: "monospace",
          }}
        >
          community@loslc.tech | loslc.tech
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}