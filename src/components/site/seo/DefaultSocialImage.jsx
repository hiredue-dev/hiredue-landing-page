import { ImageResponse } from "next/og";

export const socialImageAlt =
  "HireDue — AI job search agent and application automation";
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";

export function createDefaultSocialImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f8fbff 0%, #dcecff 48%, #d7c7ff 100%)",
        color: "#111827",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          background: "rgba(255,255,255,0.9)",
          border: "2px solid rgba(55, 105, 180, 0.16)",
          borderRadius: "42px",
          boxShadow: "0 30px 80px rgba(31, 61, 115, 0.18)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px 82px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#315ee7",
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          HireDue
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1.06,
            marginTop: 30,
            maxWidth: 950,
          }}
        >
          Your AI job search agent
        </div>
        <div
          style={{
            color: "#52606d",
            display: "flex",
            fontSize: 30,
            lineHeight: 1.35,
            marginTop: 26,
          }}
        >
          Discover, tailor, apply, and reach hiring managers faster.
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
