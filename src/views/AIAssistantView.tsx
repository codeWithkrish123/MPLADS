import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Send,
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Printer,
  ThumbsUp,
  ThumbsDown,
  Layout,
  Users,
  Building2,
  FileText,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import { AIMessage, Language, UserRole } from "../types";

interface AIAssistantViewProps {
  language?: Language;
  currentRole?: UserRole;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  language = "en",
  currentRole = "Ministry",
}) => {
  const isHindi = language === "hi";
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [userMode, setUserMode] = useState<"citizen" | "officer">("citizen");
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [key: string]: "helpful" | "not-helpful" | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "msg-0",
        role: "assistant",
        content: isHindi
          ? "Government of India • Ministry of Statistics & Programme Implementation (MoSPI)\n\nWelcome to the National MPLADS Citizen & Administrative Assistance Helpdesk.\n\nThis official electronic desk operates in accordance with the MoSPI Revised MPLADS Guidelines 2023, Public Financial Management System (PFMS) protocols, and district statutory rules.\n\nKey Areas of Official Assistance:\n1. Citizen Guidance: Permissible works in your locality, tracking local project progress, and submitting formal CPGRAMS quality complaints.\n2. MP Quota & Sanctions: Annual ₹5.00 Crore constituency entitlement, 45-day District Collector sanction rule, and negative/prohibited list.\n3. Government Audit & PFMS: CAG audit readiness, direct vendor digital transfer, and mandatory geo-tagged photographic inspection."
          : "Government of India • Ministry of Statistics & Programme Implementation (MoSPI)\n\nWelcome to the National MPLADS Citizen & Administrative Assistance Helpdesk.\n\nThis official electronic desk operates in accordance with the MoSPI Revised MPLADS Guidelines 2023, Public Financial Management System (PFMS) protocols, and district statutory rules.\n\nKey Areas of Official Assistance:\n1. Citizen Guidance: Permissible works in your locality, tracking local project progress, and submitting formal CPGRAMS quality complaints.\n2. MP Quota & Sanctions: Annual ₹5.00 Crore constituency entitlement, 45-day District Collector sanction rule, and negative/prohibited list.\n3. Government Audit & PFMS: CAG audit readiness, direct vendor digital transfer, and mandatory geo-tagged photographic inspection.",
        timestamp: isHindi ? "Just now" : "Just now",
        evidence: isHindi
          ? ["Gazette of India Notification MoSPI/MPLADS/2023/1", "DND Schedule of Rates (DSR) 2024"]
          : ["Gazette of India Notification MoSPI/MPLADS/2023/1", "DND Schedule of Rates (DSR) 2024"],
      },
    ]);
  }, [language, isHindi]);

  const quickInquiries = [
    "What public works can be built under the ₹5 Crore MPLADS fund in my locality?",
    "How do I file a formal complaint if a sanctioned project is delayed or substandard?",
    "Can MPLADS funds be used on private land, gated communities or trust properties?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = isHindi ? "hi-IN" : "en-US";

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("");
          setInputPrompt(transcript);
          transcriptRef.current = transcript;
        };

        recognition.onend = () => {
          setIsRecording(false);
          const capturedText = transcriptRef.current;
          if (capturedText && capturedText.trim().length > 0) {
            handleSendMessage(capturedText);
            transcriptRef.current = "";
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [isHindi]);

  const toggleRecording = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your query in the input box.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputPrompt("");
      transcriptRef.current = "";
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn("Speech recognition already active:", e);
      }
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = "";

      if (lower.includes("ghaziabad") || lower.includes("गाजियाबाद")) {
        responseText = isHindi
          ? "गाजियाबाद (उत्तर प्रदेश) क्षेत्र में सांसद श्री अतुल गर्ग के अंतर्गत 38 कार्य स्वीकृत हैं। कुल स्वीकृत राशि ₹3.80 करोड़ है जिसमें से ₹2.84 करोड़ (57%) का व्यय हो चुका है। भौतिक प्रगति 68% है।"
          : "In Ghaziabad (Uttar Pradesh) constituency under Lok Sabha MP Shri Atul Garg, 38 works are sanctioned totaling ₹3.80 Cr. ₹2.84 Cr (57%) has been spent with a 68% physical completion rate.";
      } else if (lower.includes("varanasi") || lower.includes("वाराणसी") || lower.includes("modi")) {
        responseText = isHindi
          ? "वाराणसी क्षेत्र में सांसद श्री नरेंद्र मोदी के अंतर्गत 42 विकास कार्य स्वीकृत हैं। कुल स्वीकृत राशि ₹4.50 करोड़ है तथा ₹4.38 करोड़ (88%) का व्यय पूरा हो चुका है।"
          : "In Varanasi (Uttar Pradesh) constituency under Prime Minister Shri Narendra Modi, 42 developmental works are sanctioned with ₹4.50 Cr approved budget and ₹4.38 Cr (88%) spent.";
      } else if (lower.includes("up") || lower.includes("uttar pradesh") || lower.includes("उत्तर प्रदेश")) {
        responseText = isHindi
          ? "उत्तर प्रदेश में कुल 2,481 एमपीएलएडीएस कार्य चालू हैं। कुल स्वीकृत राशि ₹22.5 करोड़ तथा व्यय ₹18.4 करोड़ है।"
          : "Uttar Pradesh leads with 2,481 active MPLADS works across 80 Lok Sabha constituencies. Total sanctioned funds are ₹22.5 Cr with ₹18.4 Cr actual spent and 75% average completion rate.";
      } else if (lower.includes("mp") || lower.includes("project") || lower.includes("work") || lower.includes("assigned") || lower.includes("how many") || lower.includes("quota")) {
        responseText = isHindi
          ? "संसदीय निधि के अंतर्गत हाल ही में स्वीकृत कार्यों में पेयजल सुविधाएं, ग्रामीण सड़कें तथा स्कूल भवन जीर्णोद्धार शामिल हैं। राष्ट्रीय औसत प्रगति दर 78.4% है तथा पोर्टफोलियो में 12,842 कार्यों की निगरानी की जा रही है।"
          : "Under Member of Parliament funds, recent sanctioned projects include drinking water facilities, rural road improvements, and school building renovations with a 78.4% average physical completion rate. A total of 12,842 works are monitored across 28 states.";
      } else {
        responseText = isHindi
          ? "एमपीएलएडीएस राष्ट्रीय पोर्टफोलियो में 12,842 कार्यों की वास्तविक समय निगरानी की जा रही है। 73.8% कार्य सुरक्षित क्षेत्र में हैं तथा 87 गंभीर मामले ऑडिट समीक्षा में हैं।"
          : "The MPLADS Sentinel AI surveillance system is actively monitoring 12,842 works across 28 states. 73.8% of works are in the green safety zone, 16.5% moderate risk, 9.0% high risk, and 0.7% under immediate DM audit.";
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: AIMessage = {
        id: aiMsgId,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        evidence: ["MoSPI Revised MPLADS Guidelines 2023"],
      };

      setMessages((prev) => [...prev, aiMsg]);
      handleSpeak(responseText, aiMsgId);
      setIsLoading(false);
    }, 400);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any existing speech to prevent double audio or looping
      setSpeakingId(id);

      setTimeout(() => {
        const cleanText = text.replace(/\*\*/g, "").replace(/##/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = isHindi ? "hi-IN" : "en-US";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onstart = () => setSpeakingId(id);
        utterance.onend = () => setSpeakingId(null);
        utterance.onerror = () => setSpeakingId(null);

        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const handlePrint = (content: string) => {
    const printWindow = window.open("", "", "width=900,height=600");
    if (printWindow) {
      const cleanContent = content.replace(/\*\*/g, "").replace(/##/g, "");
      printWindow.document.write(`
        <html>
          <head>
            <title>MPLADS Official Guidance</title>
            <style>
              body { font-family: 'Noto Sans', Arial, sans-serif; margin: 40px; line-height: 1.8; color: #1f2937; }
              .header { border-bottom: 3px solid #FF9933; padding-bottom: 15px; margin-bottom: 20px; }
              .header h1 { margin: 0; color: #003399; font-size: 16px; font-weight: 700; }
              .header p { margin: 5px 0; color: #6b7280; font-size: 12px; }
              .content { margin: 20px 0; font-size: 13px; line-height: 1.8; }
              .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION</h1>
              <p>National MPLADS Citizen & Administrative Helpdesk</p>
            </div>
            <div class="content">${cleanContent}</div>
            <div class="footer">
              <p>This is official guidance from the MoSPI helpdesk. For statutory decisions, contact the District Magistrate office.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleFeedback = (id: string, type: "helpful" | "not-helpful") => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 animate-in fade-in duration-200" style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', Arial, sans-serif" }}>
      {/* TOP TRICOLOR STRIPE */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* PROFESSIONAL HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Logo & Branding */}
          <div className="flex items-start gap-4 flex-1">
            {/* National Emblem - Lion Capital */}
            <img
              src="/assets/HD-wallpaper-satyamev-jayate-bharat-civil-service-history-ias-india-indian-ips-lion-emblem-motivation.jpg"
              alt="Indian National Emblem"
              className="w-14 h-14 rounded-lg shadow-md shrink-0 object-contain bg-white p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23003399%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2260%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22 font-weight=%22bold%22%3EIN%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-bold text-gray-700 tracking-wider">
                  GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
                </p>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Official e-Helpdesk
                </span>
              </div>
              <h1 className="text-base font-bold text-gray-900">
                {currentRole === "Member of Parliament"
                  ? (isHindi ? "24x7 एआई व आवाज सहायता — राष्ट्रीय सांसद निधि ज्ञान केंद्र" : "AI Help & Voice Support — National MPLADS Assistance")
                  : currentRole === "Users"
                  ? (isHindi ? "24x7 सहायता चैटबॉट और आवाज — नागरिक सहायता" : "Help Chatbot & Voice Support — Citizen & Administrative Helpdesk")
                  : (isHindi ? "24x7 एआई सहायक — सांख्यिकी मंत्रालय आधिकारिक सहायता" : "Help Chatbot & Voice Support — MoSPI Official AI Assistant")}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                MoSPI Revised Guidelines 2023, PFMS Direct Disbursal, Sanction Procedures & Citizen Grievance Assistance
              </p>
            </div>
          </div>

          {/* Right: Helpline Info Box */}
          <div className="bg-white border border-gray-300 rounded-lg p-3 shrink-0 text-right min-w-fit">
            <div className="flex items-center justify-end gap-2 mb-2">
              <Phone className="w-4 h-4 text-[#003399]" />
              <p className="text-xs text-gray-700 font-bold">National Toll-Free Helpline</p>
            </div>
            <p className="text-lg font-bold text-[#003399]">1800-11-2826</p>
            <p className="text-xs text-gray-600 mt-1">Working Days: Mon - Fri</p>
            <p className="text-xs text-gray-600">09:30 AM - 06:00 PM IST</p>
          </div>
        </div>

        {/* MODE TOGGLE & INFO */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 uppercase">Guidance Mode:</span>
            
            {/* Citizen Mode Button */}
            <button
              onClick={() => setUserMode("citizen")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                userMode === "citizen"
                  ? "bg-[#003399] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Citizen Portal
            </button>

            {/* Officer Mode Button */}
            <button
              onClick={() => setUserMode("officer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                userMode === "officer"
                  ? "bg-[#138808] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Officer & Auditor Desk
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              MoSPI 2023 Certified
            </span>
            <span>Session Ref: ResPI/2026/SAC-4</span>
          </div>
        </div>
      </div>

      {/* QUICK INQUIRIES */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="w-3.5 h-3.5 text-gray-700" />
          <p className="text-xs font-bold text-gray-700 uppercase">Quick Official Inquiries:</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickInquiries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 whitespace-nowrap hover:border-[#003399] hover:outline-2 hover:outline-[#003399] hover:outline-offset-1 transition-all font-medium shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div key={msg.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
              {isAssistant && (
                <img
                  src="/assets/{20A93098-17BC-4845-8DE2-CEB41F73B330}.png"
                  alt="Assistant"
                  className="w-8 h-8 rounded-lg shrink-0 mt-1 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23003399%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2260%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22 font-weight=%22bold%22%3EIN%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}

              <div className={`max-w-2xl ${isAssistant ? "ml-3" : "mr-3"}`}>
                {isAssistant && (
                  <div className="bg-white border border-gray-300 rounded-lg p-4 mb-2">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Ministry of Statistics & Programme Implementation
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">{msg.timestamp}</p>
                    </div>

                    {/* Content */}
                    <div className="text-xs leading-relaxed text-gray-800 mb-3 font-sans whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Evidence */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                        <p className="text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wider">
                          Statute References:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.evidence.map((ev, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2 py-1 bg-white border border-[#FF9933] rounded-full text-xs text-[#FF9933] font-semibold"
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 gap-4">
                      {/* Left: Feedback */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(msg.id, "helpful")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                            feedback[msg.id] === "helpful"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "not-helpful")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                            feedback[msg.id] === "not-helpful"
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Middle: Question */}
                      <p className="text-xs text-gray-600 flex-1 text-center">
                        Was this official guidance helpful?
                      </p>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2 ml-auto">
                        {/* Read Aloud */}
                        <button
                          onClick={() => {
                            if (speakingId === msg.id) {
                              window.speechSynthesis.cancel();
                              setSpeakingId(null);
                            } else {
                              handleSpeak(msg.content, msg.id);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                            speakingId === msg.id
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          {speakingId === msg.id ? "Stop" : "Read Aloud"}
                        </button>

                        {/* Print */}
                        <button
                          onClick={() => handlePrint(msg.content)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print Memo
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                            copiedId === msg.id
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isAssistant && (
                  <div className="bg-[#003399] text-white rounded-lg p-3">
                    <p className="text-xs font-medium">{msg.content}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <img
              src="/assets/{20A93098-17BC-4845-8DE2-CEB41F73B330}.png"
              alt="Assistant"
              className="w-8 h-8 rounded-lg shrink-0 animate-pulse object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23003399%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2260%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22 font-weight=%22bold%22%3EIN%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933] animate-spin" />
                <span>Processing official guidance...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-3">
        {/* Active Recording Banner */}
        {isRecording && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-red-700 font-mono animate-pulse">
            <span className="flex items-center gap-2 font-bold">
              <Radio className="w-4 h-4 text-red-600 animate-ping" />
              Listening to your voice query... Speak now!
            </span>
            <button
              type="button"
              onClick={toggleRecording}
              className="text-red-900 font-bold underline cursor-pointer"
            >
              Stop Recording
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isRecording
                ? "bg-red-600 text-white border-red-700 animate-pulse shadow-md"
                : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
            }`}
            title="Click to Record Voice Query"
          >
            {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5 text-[#003399]" />}
          </button>

          <input
            type="text"
            placeholder={isRecording ? "Listening to your voice..." : "Type your query or click microphone to speak..."}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#003399] focus:ring-2 focus:ring-blue-100 placeholder:text-gray-500 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-5 py-2.5 bg-[#3B5998] hover:bg-[#2D4373] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span>Submit Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#003399] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900">Revised 2023 Guidelines Manual</p>
                <p className="text-xs text-gray-600">Official MoSPI statutory circular and permissible list.</p>
              </div>
            </div>
            <a href="https://mospi.gov.in/mplads-guidelines" target="_blank" rel="noopener noreferrer" className="text-xs text-[#003399] font-semibold hover:underline inline-block">
              View Official Circular →
            </a>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900">45-Day DM Sanction SLA</p>
                <p className="text-xs text-gray-600">Statutory deadline for District Collector sanction under Para 3.4.</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold inline-block">
              Rule 3.4 Mandated
            </span>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900">CPGRAMS Public Grievance Desk</p>
                <p className="text-xs text-gray-600">Escalate unresolved civil works to Central Vigilance Desk.</p>
              </div>
            </div>
            <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 font-semibold hover:underline inline-block">
              Go to pgportal.gov.in →
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-100 border border-gray-300 rounded p-2.5 text-xs text-gray-700">
          <p className="font-medium mb-1">NIC Secure e-Governance Architecture (GIGW 3.0 Certified)</p>
          <p>Institutional guidance for public reference. Governed by official Gazette circulars.</p>
        </div>
      </div>
    </div>
  );
};
