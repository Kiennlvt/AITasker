// src/pages/client/MessagesClient.jsx
import { 
  SquarePen, 
  SlidersHorizontal, 
  Phone, 
  Video, 
  Info, 
  Paperclip, 
  Smile, 
  SendHorizontal,
  FileText,
  Download
} from "lucide-react";


export default function Messages() {
  // Dữ liệu mẫu danh sách hội thoại
  const conversations = [
    { 
      id: 1, 
      name: "Alex Rivera", 
      role: "Project Lead", 
      lastMsg: "The RAG pipeline architecture looks solid...", 
      time: "10:24 AM", 
      avatar: "https://i.pravatar.cc/150?img=11", 
      active: true 
    },
    { 
      id: 2, 
      name: "Sarah Chen", 
      role: "Architecture", 
      lastMsg: "I've attached the data cleaning scripts for review.", 
      time: "Yesterday", 
      avatar: "https://i.pravatar.cc/150?img=32", 
      active: false 
    },
    { 
      id: 3, 
      name: "Jordan Davis", 
      role: "Tuesday", 
      lastMsg: "The fine-tuning process is about 60% complete.", 
      time: "Tuesday", 
      avatar: "https://i.pravatar.cc/150?img=12", 
      active: false 
    },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
      
      {/* CỘT TRÁI: DANH SÁCH TIN NHẮN (Sidebar) */}
      <div className="w-80 md:w-96 border-r border-gray-100 flex flex-col">
        {/* Header danh sách */}
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

        {/* Danh sách chat */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 flex gap-3 cursor-pointer transition-all border-l-4 ${
                chat.active 
                ? "bg-orange-50/50 border-orange-500" 
                : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-[#1a1a3c] text-sm">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate leading-relaxed">
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: KHUNG CHAT CHI TIẾT */}
      <div className="flex-1 flex flex-col bg-[#fcfcfd]">
        
        {/* Header khung chat */}
        <div className="p-4 px-6 border-b border-gray-100 bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-[#1a1a3c] text-sm">Alex Rivera</h3>
              <p className="text-[11px] text-gray-400 font-medium">Project Lead</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><Phone size={18} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><Video size={18} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><Info size={18} /></button>
          </div>
        </div>

        {/* Nội dung tin nhắn (Scroll Area) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
          
          {/* Tin nhắn nhận được (Alex) */}
          <div className="flex items-start gap-3 max-w-[80%]">
            <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full mt-1" />
            <div className="space-y-2">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
                The RAG pipeline architecture looks solid. I've reviewed the vector database choice and the logic flow. Next we need to proceed with the integration interface.
              </div>
              <span className="text-[10px] text-gray-400 font-medium ml-1">Today, 10:24 AM</span>
            </div>
          </div>

          {/* Tin nhắn của bạn (Gửi đi) */}
          <div className="flex flex-row-reverse items-start gap-3 ml-auto max-w-[80%]">
            <div className="space-y-2 flex flex-col items-end">
              <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed">
                Absolutely, I've already implemented the REST endpoints. I'm ready to push the first set of tests for the LLM output to the staging cluster.
              </div>
              <span className="text-[10px] text-gray-400 font-medium mr-1">10:25 AM</span>
            </div>
          </div>

          {/* Tin nhắn kèm File (Alex gửi) */}
          <div className="flex items-start gap-3 max-w-[80%]">
            <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full mt-1" />
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Here is the updated architecture diagram reflecting the new node configuration.
                </p>
                {/* File Block */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group cursor-pointer hover:border-indigo-200 transition-all">
                  <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-xs font-bold text-[#1a1a3c] truncate">technical_spec_v2.pdf</h5>
                    <p className="text-[10px] text-gray-400">2.4 MB • Today, 10:14 AM</p>
                  </div>
                  <Download size={16} className="text-gray-400 group-hover:text-indigo-500" />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">10:26 AM</span>
            </div>
          </div>

        </div>

        {/* Khung nhập tin nhắn (Footer) */}
        <div className="p-4 px-6 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-100 focus-within:border-indigo-200 focus-within:bg-white transition-all">
            <button className="text-gray-400 hover:text-indigo-500 transition-colors">
              <Smile size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#1a1a3c]"
            />
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all">
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}