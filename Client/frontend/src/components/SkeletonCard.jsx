// Shimmering skeleton placeholder for loading states in the scout feed

export default function SkeletonCard() {
    return (
        <div
            style={{
                maxWidth: 480,
                margin: "0 auto",
                height: "72vh",
                minHeight: 520,
                borderRadius: 20,
                overflow: "hidden",
                background: "#161616",
                position: "relative",
            }}
        >
            {/* Shimmer sweep animation */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.8s infinite ease-in-out",
                }}
            />

            {/* Fake bottom content */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px",
                }}
            >
                {/* Name bar */}
                <div
                    style={{
                        height: 28,
                        width: "60%",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.08)",
                        marginBottom: 10,
                    }}
                />
                {/* Bio bar */}
                <div
                    style={{
                        height: 14,
                        width: "80%",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.05)",
                        marginBottom: 8,
                    }}
                />
                {/* Stats bar */}
                <div
                    style={{
                        height: 12,
                        width: "50%",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.04)",
                        marginBottom: 18,
                    }}
                />
                {/* Button bar */}
                <div
                    style={{
                        height: 44,
                        width: "100%",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.07)",
                    }}
                />
            </div>

            <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
        </div>
    );
}
