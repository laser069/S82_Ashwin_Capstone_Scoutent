import { useState } from "react";

const SPORTS = ["football", "cricket"];

const POSITIONS = {
    football: ["Winger", "Central Midfielder", "Striker", "Defender", "Fullback", "Goalkeeper"],
    cricket: ["Batsman", "Bowler", "Wicket Keeper", "All Rounder"],
};

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "mostViewed", label: "Most Viewed" },
    { value: "topRated", label: "Top Rated" },
];

export default function FilterSortBar({ filters, onFilterChange }) {
    const { sport, position, location, minAge, maxAge, sort } = filters;

    function update(key, val) {
        const next = { ...filters, [key]: val };
        // reset position when sport changes
        if (key === "sport") next.position = "";
        onFilterChange(next);
    }

    function removeFilter(key) {
        update(key, "");
    }

    // Collect active filter pills
    const activePills = [
        sport && { key: "sport", label: sport },
        position && { key: "position", label: position },
        location && { key: "location", label: location },
        (minAge || maxAge) && {
            key: "ageRange",
            label: `Age: ${minAge || "?"} – ${maxAge || "?"}`,
        },
    ].filter(Boolean);

    function clearAge() {
        onFilterChange({ ...filters, minAge: "", maxAge: "" });
    }

    return (
        <div
            style={{
                position: "sticky",
                top: 0,
                zIndex: 30,
                background: "rgba(10,10,10,0.88)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                padding: "14px 20px",
            }}
        >
            {/* ── CONTROLS ROW ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "nowrap",
                    overflowX: "auto",
                }}
            >
                {/* Sport */}
                <select
                    value={sport}
                    onChange={(e) => update("sport", e.target.value)}
                    style={selectStyle}
                >
                    <option value="">All Sports</option>
                    {SPORTS.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Position */}
                <select
                    value={position}
                    onChange={(e) => update("position", e.target.value)}
                    disabled={!sport}
                    style={{ ...selectStyle, opacity: sport ? 1 : 0.4 }}
                >
                    <option value="">All Positions</option>
                    {(POSITIONS[sport] || []).map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                {/* Location */}
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => update("location", e.target.value)}
                    style={inputStyle}
                />

                {/* Age Range */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                        type="number"
                        placeholder="Min Age"
                        value={minAge}
                        min={14}
                        max={40}
                        onChange={(e) => update("minAge", e.target.value)}
                        style={{ ...inputStyle, width: 80 }}
                    />
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>–</span>
                    <input
                        type="number"
                        placeholder="Max Age"
                        value={maxAge}
                        min={14}
                        max={40}
                        onChange={(e) => update("maxAge", e.target.value)}
                        style={{ ...inputStyle, width: 80 }}
                    />
                </div>

                {/* Sort — pushed to the right */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                        Sort by
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => update("sort", opt.value)}
                                style={{
                                    background: sort === opt.value ? "#CEFF00" : "rgba(255,255,255,0.07)",
                                    color: sort === opt.value ? "#0a0a0a" : "rgba(255,255,255,0.7)",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "6px 13px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── ACTIVE FILTER PILLS ── */}
            {activePills.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {activePills.map((pill) => (
                        <span
                            key={pill.key}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(206,255,0,0.12)",
                                border: "1px solid rgba(206,255,0,0.35)",
                                color: "#CEFF00",
                                borderRadius: 999,
                                padding: "3px 12px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                            }}
                        >
                            {pill.label}
                            <button
                                onClick={() =>
                                    pill.key === "ageRange" ? clearAge() : removeFilter(pill.key)
                                }
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#CEFF00",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: 1,
                                    fontSize: "0.9rem",
                                    opacity: 0.7,
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// Shared styles
const selectStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "rgba(255,255,255,0.85)",
    padding: "7px 12px",
    fontSize: "0.8rem",
    cursor: "pointer",
    outline: "none",
    minWidth: 110,
    appearance: "none",
    WebkitAppearance: "none",
};

const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "rgba(255,255,255,0.85)",
    padding: "7px 12px",
    fontSize: "0.8rem",
    outline: "none",
    width: 120,
};
