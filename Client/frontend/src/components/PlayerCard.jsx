import { useRef, useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

// PlayerCard — cinematic video card for the scout discovery feed
// forwardRef exposes the inner <video> element so the parent's
// single IntersectionObserver can manage play/pause across all cards.

const PlayerCard = forwardRef(function PlayerCard({ player, onBookmark, isBookmarked }, videoRef) {
    const navigate = useNavigate();
    const [muted, setMuted] = useState(true);
    const [videoError, setVideoError] = useState(false);

    const {
        _id,
        playerName,
        position,
        age,
        location,
        bio,
        sport,
        videoUrl,
        playerImageUrl,
    } = player;

    const statParts = [
        position || "—",
        age ? `${age} yrs` : "—",
        location || "Unknown",
    ].join("  •  ");

    function handleMuteToggle(e) {
        e.stopPropagation();
        if (videoRef?.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
        }
    }

    return (
        <article
            className="relative w-full overflow-hidden cursor-pointer group"
            style={{
                maxWidth: 480,
                margin: "0 auto",
                height: "72vh",
                minHeight: 520,
                borderRadius: 20,
                boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
                background: "#111",
                transition: "transform 0.25s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.005)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {/* ── VIDEO / FALLBACK ── */}
            {videoUrl && !videoError ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    preload="metadata"
                    autoPlay={false}
                    muted
                    loop
                    playsInline
                    onError={() => setVideoError(true)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: playerImageUrl ? `url(${playerImageUrl})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "#1a1a1a",
                    }}
                />
            )}

            {/* ── GRADIENT OVERLAY ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 70%, transparent 100%)",
                }}
            />

            {/* ── SPORT BADGE (top-left) ── */}
            <div
                style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#CEFF00",
                }}
            >
                {sport || "Sport"}
            </div>

            {/* ── MUTE TOGGLE (top-right) ── */}
            {videoUrl && !videoError && (
                <button
                    onClick={handleMuteToggle}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(8px)",
                        border: "none",
                        borderRadius: 10,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.8)",
                        transition: "background 0.2s ease",
                    }}
                    title={muted ? "Unmute" : "Mute"}
                >
                    {muted ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
                            <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    )}
                </button>
            )}

            {/* ── BOTTOM INFO PANEL ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 24px 20px",
                }}
            >
                {/* Name */}
                <h2
                    style={{
                        fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.1,
                        margin: "0 0 4px",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {playerName || "Unknown Player"}
                </h2>

                {/* Bio */}
                {bio && (
                    <p
                        style={{
                            fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.65)",
                            fontStyle: "italic",
                            margin: "0 0 10px",
                            lineHeight: 1.4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {bio}
                    </p>
                )}

                {/* Stats row */}
                <p
                    style={{
                        fontSize: "0.78rem",
                        letterSpacing: "0.05em",
                        opacity: 0.72,
                        color: "#fff",
                        fontFamily: "monospace",
                        margin: "0 0 16px",
                    }}
                >
                    {statParts}
                </p>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                    {/* View Profile */}
                    <button
                        onClick={() => navigate(`/players/${_id}`)}
                        style={{
                            flex: 1,
                            background: "#fff",
                            color: "#0a0a0a",
                            border: "none",
                            borderRadius: 999,
                            padding: "10px 24px",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#CEFF00")}
                        onMouseLeave={(e) => (e.target.style.background = "#fff")}
                    >
                        View Profile
                    </button>

                    {/* Bookmark */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onBookmark?.(_id); }}
                        title={isBookmarked ? "Remove from shortlist" : "Add to shortlist"}
                        style={{
                            background: isBookmarked
                                ? "rgba(206,255,0,0.25)"
                                : "rgba(255,255,255,0.1)",
                            border: isBookmarked
                                ? "1px solid rgba(206,255,0,0.6)"
                                : "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 12,
                            width: 46,
                            height: 46,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: isBookmarked ? "#CEFF00" : "rgba(255,255,255,0.8)",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} width={20} height={20}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
});

export default PlayerCard;
