import { useState, useEffect, useRef, useCallback, createRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import PlayerCard from "../components/PlayerCard";
import FilterSortBar from "../components/FilterSortBar";
import SkeletonCard from "../components/SkeletonCard";

// ─────────────────────────────────────────
// SHORTLIST HELPERS (localStorage)
// ─────────────────────────────────────────
function loadShortlist() {
  try {
    return JSON.parse(localStorage.getItem("scoutShortlist") || "[]");
  } catch {
    return [];
  }
}
function saveShortlist(list) {
  localStorage.setItem("scoutShortlist", JSON.stringify(list));
}

// ─────────────────────────────────────────
// LEFT SIDEBAR
// ─────────────────────────────────────────
function Sidebar({ navigate }) {
  const userName = localStorage.getItem("userName") || "Scout";

  const links = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      label: "Discovery Feed",
      active: true,
      action: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      label: "Messages",
      active: false,
      action: () => navigate("/messages"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      label: "Scout Point",
      active: false,
      action: () => navigate("/scoutpoint"),
    },
  ];

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        background: "#0a0a0a",
        padding: "28px 0",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "0 24px 32px",
          fontSize: "1.6rem",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.04em",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        SCOUT<span style={{ color: "#CEFF00" }}>ENT</span>
      </div>

      {/* User pill */}
      <div
        style={{
          margin: "0 16px 28px",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#CEFF00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            color: "#000",
            fontSize: "0.85rem",
            flexShrink: 0,
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
            {userName}
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
            Scout
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" }}>
        {links.map((link) => (
          <button
            key={link.label}
            onClick={link.action}
            disabled={!link.action && !link.active}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              background: link.active ? "rgba(206,255,0,0.1)" : "transparent",
              border: link.active ? "1px solid rgba(206,255,0,0.2)" : "1px solid transparent",
              color: link.active ? "#CEFF00" : "rgba(255,255,255,0.55)",
              fontWeight: link.active ? 700 : 500,
              fontSize: "0.85rem",
              cursor: link.action ? "pointer" : "default",
              textAlign: "left",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!link.active && link.action) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!link.active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }
            }}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/login");
        }}
        style={{
          marginTop: "auto",
          marginLeft: 12,
          marginRight: 12,
          padding: "11px 14px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.8rem",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ff6b6b";
          e.currentTarget.style.borderColor = "rgba(255,107,107,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.35)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={16} height={16}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Logout
      </button>
    </aside>
  );
}

// ─────────────────────────────────────────
// RIGHT SHORTLIST SIDEBAR
// ─────────────────────────────────────────
function ShortlistSidebar({ shortlist, players, onRemove }) {
  const shortlisted = players.filter((p) => shortlist.includes(p._id));

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        background: "#0a0a0a",
        padding: "28px 0",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "0 20px 20px" }}>
        <p style={{ color: "#CEFF00", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 4 }}>
          Shortlisted
        </p>
        <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
          My Players
        </h2>
        <div style={{ height: 2, width: 28, background: "#CEFF00", marginTop: 10 }} />
      </div>

      {shortlisted.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} width={40} height={40} style={{ margin: "0 auto 12px", display: "block" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem", lineHeight: 1.5 }}>
            Bookmark players from the feed to shortlist them here
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 12px" }}>
          {shortlisted.map((player) => (
            <div
              key={player._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Avatar */}
              {player.playerImageUrl ? (
                <img
                  src={player.playerImageUrl}
                  alt={player.playerName}
                  style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(206,255,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#CEFF00",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {player.playerName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {player.playerName}
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {player.position} · {player.age} yrs
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemove(player._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                  flexShrink: 0,
                  lineHeight: 1,
                  fontSize: "1rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ff6b6b")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.25)")}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

// ─────────────────────────────────────────
// MAIN SCOUT FEED PAGE
// ─────────────────────────────────────────
const DEFAULT_FILTERS = {
  sport: "",
  position: "",
  location: "",
  minAge: "",
  maxAge: "",
  sort: "newest",
};

export default function ScoutFeedPage() {
  const navigate = useNavigate();

  // Feed state
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [error, setError] = useState(null);

  // Shortlist state
  const [shortlist, setShortlist] = useState(loadShortlist);

  // Refs
  const feedRef = useRef(null);                 // scrollable container
  const videoRefs = useRef({});                  // map: _id → video element ref
  const observerRef = useRef(null);              // IntersectionObserver
  const sentinelRef = useRef(null);              // infinite scroll trigger
  const activeVideoId = useRef(null);            // currently playing video id

  // ── FETCH FEED ──
  const fetchFeed = useCallback(async (pg, activeFilters, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", pg);
      if (activeFilters.sport) params.set("sport", activeFilters.sport);
      if (activeFilters.position) params.set("position", activeFilters.position);
      if (activeFilters.location) params.set("location", activeFilters.location);
      if (activeFilters.minAge) params.set("minAge", activeFilters.minAge);
      if (activeFilters.maxAge) params.set("maxAge", activeFilters.maxAge);
      params.set("sort", activeFilters.sort);

      const res = await axiosInstance.get(`/videos/feed?${params.toString()}`);
      const { videos, hasMore: more } = res.data;

      setPlayers((prev) => append ? [...prev, ...videos] : videos);
      setHasMore(more);
    } catch (err) {
      console.error(err);
      setError("Failed to load feed. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial + filter change fetch
  useEffect(() => {
    setPage(1);
    setPlayers([]);
    setHasMore(true);
    videoRefs.current = {};
    activeVideoId.current = null;
    if (feedRef.current) feedRef.current.scrollTop = 0;
    fetchFeed(1, filters, false);
  }, [filters, fetchFeed]);

  // Fetch next page (infinite scroll)
  useEffect(() => {
    if (page > 1) fetchFeed(page, filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── INTERSECTION OBSERVER — VIDEO PLAY/PAUSE ──
  useEffect(() => {
    // Disconnect old observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.videoid;
          const video = videoRefs.current[id];
          if (!video) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Pause the previously active video
            if (activeVideoId.current && activeVideoId.current !== id) {
              const prev = videoRefs.current[activeVideoId.current];
              if (prev) prev.pause();
            }
            video.preload = "auto";
            video.play().catch(() => { }); // autoplay may be blocked
            activeVideoId.current = id;
          } else {
            video.pause();
          }
        });
      },
      {
        root: feedRef.current,
        threshold: 0.5,
      }
    );

    // Observe all current card elements
    const cards = feedRef.current?.querySelectorAll("[data-videoid]");
    cards?.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [players]);

  // ── INFINITE SCROLL SENTINEL ──
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const sentinelObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { root: feedRef.current, threshold: 0.1 }
    );
    sentinelObserver.observe(sentinel);
    return () => sentinelObserver.disconnect();
  }, [hasMore, loading, players]);

  // ── SHORTLIST HANDLERS ──
  function handleBookmark(id) {
    setShortlist((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      saveShortlist(next);
      return next;
    });
  }

  function handleRemoveShortlist(id) {
    setShortlist((prev) => {
      const next = prev.filter((i) => i !== id);
      saveShortlist(next);
      return next;
    });
  }

  // ── FILTER CHANGE ──
  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  // ── VIDEO REF CALLBACK ──
  // Called by each PlayerCard to register its <video> element
  function setVideoRef(id, el) {
    videoRefs.current[id] = el;
  }

  // ─────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Sidebar navigate={navigate} />

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Filter bar — sticky inside this column */}
        <FilterSortBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Scrollable feed */}
        <div
          ref={feedRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px 48px",
            scrollBehavior: "smooth",
          }}
        >
          {/* Column centering wrapper */}
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Header */}
            <div style={{ paddingBottom: 4 }}>
              <p style={{ color: "#CEFF00", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 4px", }}>
                Scout Discovery
              </p>
              <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0, }}>
                Player Feed
              </h1>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: 16 }}>{error}</p>
                <button
                  onClick={() => fetchFeed(1, filters, false)}
                  style={{
                    background: "#CEFF00",
                    color: "#000",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && players.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 0" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} width={64} height={64} style={{ margin: "0 auto 20px", display: "block" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "1rem", marginBottom: 6 }}>No players found</p>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>Try adjusting your filters</p>
              </div>
            )}

            {/* Player cards */}
            {players.map((player) => (
              <div
                key={player._id}
                data-videoid={player._id}
              >
                <PlayerCard
                  player={player}
                  ref={(el) => setVideoRef(player._id, el)}
                  onBookmark={handleBookmark}
                  isBookmarked={shortlist.includes(player._id)}
                />
              </div>
            ))}

            {/* Loading skeletons */}
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {/* Infinite scroll sentinel */}
            {!loading && hasMore && (
              <div ref={sentinelRef} style={{ height: 1 }} />
            )}

            {/* End of feed */}
            {!loading && !hasMore && players.length > 0 && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  You've seen all players
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RIGHT SHORTLIST SIDEBAR */}
      <ShortlistSidebar
        shortlist={shortlist}
        players={players}
        onRemove={handleRemoveShortlist}
      />
    </div>
  );
}