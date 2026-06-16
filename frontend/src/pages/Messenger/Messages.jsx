import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import {
  SquarePen,
  SlidersHorizontal,
  Phone,
  Video,
  Info,
  SendHorizontal,
  MessageSquare,
  Wifi,
  WifiOff,
} from "lucide-react";
import api from "../../api/client";
import useAuthStore from "../../store/authStore";

function formatTime(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  if (date.toDateString() === now.toDateString()) return `${hh}:${mm}`;
  const dd = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mo} ${hh}:${mm}`;
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ url, name, size = "w-12 h-12", textSize = "text-sm" }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${size} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold ${textSize} shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 flex gap-3 border-l-4 border-transparent">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          </div>
        </div>
      ))}
    </>
  );
}

function MessageSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${i % 2 !== 0 ? "flex-row-reverse" : ""}`}
        >
          {i % 2 === 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
          )}
          <div
            className={`h-10 rounded-2xl bg-gray-200 animate-pulse ${
              i % 2 === 0 ? "w-48" : "w-64"
            }`}
          />
        </div>
      ))}
    </>
  );
}

export default function Messages() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  // activeConv is the full InboxItemDto object
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  const stompRef = useRef(null);
  const subscriptionRef = useRef(null);
  const activeConvRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageHandlerRef = useRef(null);

  // Keep ref in sync for WebSocket closure
  activeConvRef.current = activeConv;

  messageHandlerRef.current = (msg) => {
    const conv = activeConvRef.current;
    if (!conv) return;
    const msgConvId = msg.conversationId;
    if (msgConvId === conv.conversationId) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    }
    // Update last message preview in sidebar
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.conversationId === msgConvId);
      if (idx === -1) return prev;
      const updated = {
        ...prev[idx],
        lastMessage: msg.content,
        lastMessageTime: msg.createdAt,
        lastSenderId: msg.senderId,
      };
      return [updated, ...prev.filter((_, i) => i !== idx)];
    });
  };

  const getWsTopic = (conv) => {
    if (!conv) return null;
    return `/topic/conversation.${conv.conversationId}`;
  };

  const subscribeToConv = (client, conv) => {
    if (subscriptionRef.current) {
      try { subscriptionRef.current.unsubscribe(); } catch (_) {}
      subscriptionRef.current = null;
    }
    const topic = getWsTopic(conv);
    if (!topic) return;
    subscriptionRef.current = client.subscribe(topic, (frame) => {
      try {
        const msg = JSON.parse(frame.body);
        messageHandlerRef.current(msg);
      } catch (_) {}
    });
  };

  // WebSocket: connect once, reconnect automatically
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setWsConnected(true);
        if (activeConvRef.current) {
          subscribeToConv(client, activeConvRef.current);
        }
      },
      onDisconnect: () => setWsConnected(false),
      onStompError: () => setWsConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-subscribe when active conversation changes
  useEffect(() => {
    const client = stompRef.current;
    if (client?.connected) {
      subscribeToConv(client, activeConv);
    }
  }, [activeConv]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load conversation list
  useEffect(() => {
    setLoadingConvs(true);
    api
      .get("/messages/inbox")
      .then((res) => {
        const data = res.data?.data ?? [];
        setConversations(data);

        // Support URL param ?conversationId=X to pre-select a specific conversation
        const paramId = searchParams.get("conversationId");
        if (paramId) {
          const match = data.find((c) => c.conversationId === paramId);
          if (match) { setActiveConv(match); return; }
        }
        if (data.length > 0) setActiveConv(data[0]);
      })
      .catch(() => toast.error("Không thể tải danh sách hội thoại"))
      .finally(() => setLoadingConvs(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch messages when switching conversation
  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    setMessages([]);
    api
      .get(`/messages/conversation/${activeConv.conversationId}`)
      .then((res) => setMessages(res.data?.data ?? []))
      .catch(() => toast.error("Không thể tải tin nhắn"))
      .finally(() => setLoadingMsgs(false));
  }, [activeConv?.conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || !activeConv || sending) return;
    setInput("");
    setSending(true);
    try {
      await api.post("/messages", { conversationId: activeConv.conversationId, content });
    } catch {
      toast.error("Không thể gửi tin nhắn");
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">

      {/* SIDEBAR */}
      <div className="w-80 md:w-96 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-2xl font-bold text-[#1a1a3c]">Messages</h2>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
              <SquarePen size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <ConversationSkeleton />
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 gap-3">
              <MessageSquare size={40} className="opacity-30" />
              <p className="text-sm text-center">Chưa có hội thoại nào</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.conversationId === activeConv?.conversationId;
              const isMyLastMsg = String(conv.lastSenderId) === String(user?.id);
              return (
                <div
                  key={conv.conversationId}
                  onClick={() => setActiveConv(conv)}
                  className={`p-4 flex gap-3 cursor-pointer transition-all border-l-4 ${
                    isActive
                      ? "bg-orange-50/50 border-orange-500"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <Avatar
                    url={conv.otherPartyAvatarUrl}
                    name={conv.otherPartyName}
                    size="w-12 h-12"
                    textSize="text-sm"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-[#1a1a3c] text-sm truncate">
                        {conv.otherPartyName}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate leading-relaxed">
                      {isMyLastMsg && <span className="font-medium">Bạn: </span>}
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col bg-[#fcfcfd] min-w-0">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center space-y-3">
              <MessageSquare size={48} className="mx-auto opacity-20" />
              <p className="text-sm">Chọn một hội thoại để bắt đầu</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header — shows the OTHER person */}
            <div className="p-4 px-6 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <Avatar
                  url={activeConv.otherPartyAvatarUrl}
                  name={activeConv.otherPartyName}
                  size="w-10 h-10"
                  textSize="text-sm"
                />
                <div>
                  <h3 className="font-bold text-[#1a1a3c] text-sm">
                    {activeConv.otherPartyName}
                  </h3>
                  {wsConnected ? (
                    <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                      <Wifi size={11} /> Đã kết nối
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                      <WifiOff size={11} /> Đang kết nối lại...
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {loadingMsgs ? (
                <MessageSkeleton />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <MessageSquare size={36} className="opacity-20" />
                  <p className="text-sm">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = String(msg.senderId) === String(user?.id);
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
                    >
                      {!isMine && (
                        <Avatar
                          url={msg.senderAvatarUrl}
                          name={msg.senderName}
                          size="w-8 h-8"
                          textSize="text-xs"
                        />
                      )}
                      <div
                        className={`flex flex-col max-w-[75%] ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        {!isMine && (
                          <span className="text-[11px] text-gray-500 font-medium mb-1 ml-1">
                            {msg.senderName}
                          </span>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                            isMine
                              ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                              : "bg-white text-gray-700 rounded-bl-none border border-gray-100 shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium mt-1 mx-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 px-6 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-end gap-3 bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-100 focus-within:border-indigo-200 focus-within:bg-white transition-all">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[#1a1a3c] resize-none max-h-32 py-1.5"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 mb-0.5"
                >
                  <SendHorizontal size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
