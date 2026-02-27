import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "../utils/socket";

// ─── Helpers ────────────────────────────────────────────────────────────────
function getInitials(name = "") {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
function formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
}

// ─── Typing Dots ─────────────────────────────────────────────────────────────
function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 14px" }}>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#CEFF00",
                        display: "block",
                    }}
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                />
            ))}
        </div>
    );
}

// ─── Conversation Item ────────────────────────────────────────────────────────
function ConvItem({ conv, isActive, onClick }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: 4 }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "14px 16px",
                background: isActive ? "rgba(206,255,0,0.08)" : "transparent",
                border: "none",
                borderLeft: isActive ? "3px solid #CEFF00" : "3px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.2s ease",
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: isActive ? "#CEFF00" : "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.8rem",
                    color: isActive ? "#000" : "#fff",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                }}
            >
                {getInitials(conv.name)}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: isActive ? "#CEFF00" : "#fff" }}>
                        {conv.name}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
                        {formatTime(conv.lastMessageAt)}
                    </span>
                </div>
                <p
                    style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.35)",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {conv.lastMessage || "Start a conversation"}
                </p>
            </div>

            {/* Unread badge */}
            {conv.unread > 0 && (
                <div
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#CEFF00",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 900,
                        color: "#000",
                        flexShrink: 0,
                    }}
                >
                    {conv.unread}
                </div>
            )}
        </motion.button>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function Bubble({ msg, isMine }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: 8,
            }}
        >
            <div
                style={{
                    maxWidth: "68%",
                    padding: "10px 16px",
                    borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isMine ? "#CEFF00" : "rgba(255,255,255,0.07)",
                    color: isMine ? "#000" : "#fff",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    fontWeight: isMine ? 600 : 400,
                    wordBreak: "break-word",
                }}
            >
                {msg.content}
                <div
                    style={{
                        fontSize: "0.65rem",
                        marginTop: 4,
                        textAlign: "right",
                        opacity: 0.55,
                        color: isMine ? "#000" : "rgba(255,255,255,0.5)",
                    }}
                >
                    {formatTime(msg.createdAt)}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Empty Chat State ─────────────────────────────────────────────────────────
function EmptyChatState() {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0.4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#CEFF00" strokeWidth={1.2} width={52} height={52}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p style={{ color: "#fff", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6 }}>
                Select a conversation<br />or start a new one
            </p>
        </div>
    );
}

// ─── New Conversation Modal ───────────────────────────────────────────────────
function NewConvModal({ users, onSelect, onClose }) {
    const [search, setSearch] = useState("");
    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    width: "100%",
                    maxWidth: 420,
                    padding: 24,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", margin: 0 }}>New Conversation</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                </div>

                <input
                    autoFocus
                    placeholder="Search users…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 12,
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto" }}>
                    {filtered.length === 0 && (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", padding: "12px 0", textAlign: "center" }}>No users found</p>
                    )}
                    {filtered.map((u) => (
                        <button
                            key={u._id}
                            onClick={() => onSelect(u)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 12px",
                                background: "transparent",
                                border: "none",
                                borderRadius: 10,
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(206,255,0,0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(206,255,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", color: "#CEFF00", flexShrink: 0 }}>
                                {getInitials(u.name)}
                            </div>
                            <div>
                                <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{u.name}</div>
                                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{u.role}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── MAIN MESSAGES PAGE ───────────────────────────────────────────────────────
export default function MessagesPage() {
    const navigate = useNavigate();
    const { userId: routeUserId } = useParams();

    const myId = localStorage.getItem("userId");
    const myName = localStorage.getItem("userName") || "Me";
    const token = localStorage.getItem("token");

    const socket = useSocket(myId);

    const [conversations, setConversations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeConv, setActiveConv] = useState(null); // { userId, name, role }
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showNewConv, setShowNewConv] = useState(false);
    const [convLoading, setConvLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);
    const [showMobileList, setShowMobileList] = useState(true);

    const messagesEndRef = useRef(null);
    const typingTimerRef = useRef(null);
    const inputRef = useRef(null);

    // ── Auth header ──
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // ── Scroll to bottom ──
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // ── Fetch conversations ──
    const fetchConversations = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/chat/conversations", authHeader);
            setConversations(res.data);
        } catch (err) {
            console.error("fetchConversations:", err);
        } finally {
            setConvLoading(false);
        }
    }, []);

    // ── Fetch all users (for new convo modal) ──
    const fetchAllUsers = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/chat/users", authHeader);
            setAllUsers(res.data);
        } catch (err) {
            console.error("fetchAllUsers:", err);
        }
    }, []);

    // ── Load message history ──
    const openConversation = useCallback(async (conv) => {
        setActiveConv(conv);
        setMessages([]);
        setMsgLoading(true);
        setShowMobileList(false);
        try {
            const res = await axiosInstance.get(`/chat/messages/${conv.userId}`, authHeader);
            setMessages(res.data.messages || []);
            // Mark as read
            await axiosInstance.post(`/chat/mark-read/${conv.userId}`, {}, authHeader);
            // Clear unread badge
            setConversations((prev) =>
                prev.map((c) => (c.userId === conv.userId ? { ...c, unread: 0 } : c))
            );
        } catch (err) {
            console.error("openConversation:", err);
        } finally {
            setMsgLoading(false);
        }
    }, []);

    // ── Initial load ──
    useEffect(() => {
        fetchConversations();
        fetchAllUsers();
    }, [fetchConversations, fetchAllUsers]);

    // ── Open from URL param ──
    useEffect(() => {
        if (routeUserId && allUsers.length > 0) {
            const user = allUsers.find((u) => u._id === routeUserId);
            if (user) {
                openConversation({ userId: user._id, name: user.name, role: user.role });
            }
        }
    }, [routeUserId, allUsers]);

    // ── Socket listeners ──
    useEffect(() => {
        if (!socket) return;

        const handleReceive = (msg) => {
            // If in current convo, append
            if (activeConv && msg.senderId === activeConv.userId) {
                setMessages((prev) => [...prev, msg]);
                // Mark as read immediately
                axiosInstance.post(`/chat/mark-read/${activeConv.userId}`, {}, authHeader).catch(() => { });
            } else {
                // Update unread badge
                setConversations((prev) =>
                    prev.map((c) =>
                        c.userId === msg.senderId
                            ? { ...c, unread: (c.unread || 0) + 1, lastMessage: msg.content, lastMessageAt: msg.createdAt }
                            : c
                    )
                );
                // Add convo if not present
                setConversations((prev) => {
                    const exists = prev.find((c) => c.userId === msg.senderId);
                    if (!exists) {
                        fetchConversations();
                    }
                    return prev;
                });
            }
        };

        const handleSent = (msg) => {
            setMessages((prev) => {
                // Replace optimistic message (temp id) with real one
                const filtered = prev.filter((m) => m._tempId !== msg._tempId);
                return [...filtered, msg];
            });
        };

        const handleTyping = ({ senderId }) => {
            if (activeConv && senderId === activeConv.userId) setIsTyping(true);
        };
        const handleStopTyping = ({ senderId }) => {
            if (activeConv && senderId === activeConv.userId) setIsTyping(false);
        };

        socket.on("receive_message", handleReceive);
        socket.on("message_sent", handleSent);
        socket.on("user_typing", handleTyping);
        socket.on("user_stop_typing", handleStopTyping);

        return () => {
            socket.off("receive_message", handleReceive);
            socket.off("message_sent", handleSent);
            socket.off("user_typing", handleTyping);
            socket.off("user_stop_typing", handleStopTyping);
        };
    }, [socket, activeConv]);

    // ── Scroll on new messages ──
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // ── Send message ──
    const handleSend = useCallback(() => {
        const content = inputText.trim();
        if (!content || !activeConv || !myId) return;

        const tempId = `temp_${Date.now()}`;
        const optimistic = {
            _tempId: tempId,
            senderId: myId,
            receiverId: activeConv.userId,
            content,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimistic]);
        setInputText("");

        socket.emit("send_message", {
            senderId: myId,
            receiverId: activeConv.userId,
            content,
            _tempId: tempId,
        });

        // Update conversation last message locally
        setConversations((prev) => {
            const exists = prev.find((c) => c.userId === activeConv.userId);
            if (exists) {
                return prev.map((c) =>
                    c.userId === activeConv.userId
                        ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
                        : c
                );
            } else {
                return [
                    {
                        userId: activeConv.userId,
                        name: activeConv.name,
                        role: activeConv.role,
                        avatar: getInitials(activeConv.name),
                        lastMessage: content,
                        lastMessageAt: new Date().toISOString(),
                        unread: 0,
                    },
                    ...prev,
                ];
            }
        });

        // Stop typing signal
        socket.emit("stop_typing", { senderId: myId, receiverId: activeConv.userId });
        clearTimeout(typingTimerRef.current);
    }, [inputText, activeConv, myId, socket]);

    // ── Typing signals ──
    const handleInputChange = (e) => {
        setInputText(e.target.value);
        if (!activeConv || !myId) return;

        socket.emit("typing", { senderId: myId, receiverId: activeConv.userId });
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            socket.emit("stop_typing", { senderId: myId, receiverId: activeConv.userId });
        }, 1500);
    };

    // ── Start new conversation ──
    const handleSelectUser = (user) => {
        setShowNewConv(false);
        openConversation({ userId: user._id, name: user.name, role: user.role });
    };

    // ── Styles ──
    const S = {
        page: {
            display: "flex",
            height: "100vh",
            background: "#0a0a0a",
            color: "#fff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            overflow: "hidden",
        },
        // Left nav sidebar (same as scout homepage)
        navSidebar: {
            width: 72,
            flexShrink: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: "#0a0a0a",
            padding: "20px 0",
            gap: 8,
        },
        // Conversation list panel
        convPanel: {
            width: 300,
            flexShrink: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: "#0d0d0d",
        },
        // Chat area
        chatPanel: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: "#0a0a0a",
        },
    };

    // ── Render ──
    return (
        <div style={S.page}>

            {/* ── LEFT ICON SIDEBAR ─────────────────────────────────── */}
            <aside style={S.navSidebar}>
                {/* Logo */}
                <div
                    onClick={() => navigate("/playerhomepage")}
                    style={{
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        fontStyle: "italic",
                        color: "#fff",
                        cursor: "pointer",
                        letterSpacing: "-0.04em",
                        marginBottom: 12,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                    }}
                >
                    SCOUT<span style={{ color: "#CEFF00" }}>ENT</span>
                </div>

                {/* Nav icons */}
                {[
                    {
                        label: "Home",
                        path: "/playerhomepage",
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        ),
                    },
                    {
                        label: "Messages",
                        path: "/messages",
                        active: true,
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        ),
                    },
                    {
                        label: "Scout Point",
                        path: "/scoutpoint",
                        icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        ),
                    },
                ].map((link) => (
                    <button
                        key={link.label}
                        title={link.label}
                        onClick={() => navigate(link.path)}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: link.active ? "rgba(206,255,0,0.15)" : "transparent",
                            border: link.active ? "1px solid rgba(206,255,0,0.3)" : "1px solid transparent",
                            color: link.active ? "#CEFF00" : "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (!link.active) {
                                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                e.currentTarget.style.color = "#fff";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!link.active) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                            }
                        }}
                    >
                        {link.icon}
                    </button>
                ))}

                {/* Spacer + Logout */}
                <button
                    title="Logout"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        navigate("/login");
                    }}
                    style={{
                        marginTop: "auto",
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "rgba(255,255,255,0.25)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ff6b6b";
                        e.currentTarget.style.background = "rgba(255,107,107,0.08)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.25)";
                        e.currentTarget.style.background = "transparent";
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </button>
            </aside>

            {/* ── CONVERSATION LIST PANEL ───────────────────────────── */}
            <div style={S.convPanel}>
                {/* Header */}
                <div style={{ padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ color: "#CEFF00", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 2px" }}>Inbox</p>
                            <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                                Messages
                            </h1>
                        </div>
                        {/* New convo button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNewConv(true)}
                            title="New Conversation"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "#CEFF00",
                                border: "none",
                                color: "#000",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={16} height={16}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </motion.button>
                    </div>
                    <div style={{ height: 2, width: 28, background: "#CEFF00", marginTop: 10 }} />
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
                    {convLoading ? (
                        /* Skeleton */
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", alignItems: "center" }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 8, width: "60%" }} />
                                    <div style={{ height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "85%" }} />
                                </div>
                            </div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div style={{ padding: "32px 16px", textAlign: "center" }}>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                                No conversations yet.<br />
                                <span
                                    onClick={() => setShowNewConv(true)}
                                    style={{ color: "#CEFF00", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Start one
                                </span>
                            </p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <ConvItem
                                key={conv.userId}
                                conv={conv}
                                isActive={activeConv?.userId === conv.userId}
                                onClick={() => openConversation(conv)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── CHAT PANEL ────────────────────────────────────────── */}
            <div style={S.chatPanel}>
                {!activeConv ? (
                    <EmptyChatState />
                ) : (
                    <>
                        {/* Chat Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                padding: "16px 24px",
                                borderBottom: "1px solid rgba(255,255,255,0.07)",
                                background: "#0d0d0d",
                                flexShrink: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: "50%",
                                    background: "#CEFF00",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                    fontSize: "0.8rem",
                                    color: "#000",
                                    flexShrink: 0,
                                }}
                            >
                                {getInitials(activeConv.name)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>{activeConv.name}</div>
                                <div
                                    style={{
                                        fontSize: "0.68rem",
                                        color: "#CEFF00",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.12em",
                                        fontWeight: 700,
                                    }}
                                >
                                    {activeConv.role}
                                </div>
                            </div>
                            {/* Live badge */}
                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#CEFF00", display: "block" }} />
                                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Live</span>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "20px 24px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {msgLoading ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                                                width: `${40 + Math.random() * 30}%`,
                                                height: 40,
                                                background: "rgba(255,255,255,0.04)",
                                                borderRadius: 12,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 }}>
                                    <p style={{ color: "#fff", fontSize: "0.82rem", textAlign: "center", lineHeight: 1.6 }}>
                                        No messages yet.<br />Say hello! 👋
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <Bubble
                                        key={msg._id || msg._tempId || i}
                                        msg={msg}
                                        isMine={
                                            (msg.senderId?._id || msg.senderId) === myId ||
                                            msg.senderId === myId
                                        }
                                    />
                                ))
                            )}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        style={{
                                            alignSelf: "flex-start",
                                            background: "rgba(255,255,255,0.07)",
                                            borderRadius: "18px 18px 18px 4px",
                                            display: "inline-flex",
                                        }}
                                    >
                                        <TypingDots />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input bar */}
                        <div
                            style={{
                                padding: "14px 20px",
                                borderTop: "1px solid rgba(255,255,255,0.07)",
                                background: "#0d0d0d",
                                display: "flex",
                                gap: 10,
                                alignItems: "center",
                                flexShrink: 0,
                            }}
                        >
                            <input
                                ref={inputRef}
                                id="chat-input"
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type a message…"
                                style={{
                                    flex: 1,
                                    padding: "12px 18px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 24,
                                    color: "#fff",
                                    fontSize: "0.88rem",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(206,255,0,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                            />
                            <motion.button
                                id="send-btn"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.93 }}
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                                style={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: "50%",
                                    background: inputText.trim() ? "#CEFF00" : "rgba(255,255,255,0.06)",
                                    border: "none",
                                    cursor: inputText.trim() ? "pointer" : "default",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background 0.2s ease",
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={inputText.trim() ? "#000" : "rgba(255,255,255,0.25)"}
                                    strokeWidth={2.2}
                                    width={18}
                                    height={18}
                                    style={{ transform: "rotate(90deg)" }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </motion.button>
                        </div>
                    </>
                )}
            </div>

            {/* ── NEW CONVERSATION MODAL ─────────────────────────────── */}
            <AnimatePresence>
                {showNewConv && (
                    <NewConvModal
                        users={allUsers}
                        onSelect={handleSelectUser}
                        onClose={() => setShowNewConv(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
