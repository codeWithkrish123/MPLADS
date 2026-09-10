import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  RefreshCw,
  Copy,
  Check,
  Radio,
  ShieldCheck,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WorkRecord, StateSummary } from "../../types";

interface AIHelpdeskVoiceAssistantProps {
  works?: WorkRecord[];
  states?: StateSummary[];
  isHindi?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  audioSpoken?: boolean;
  dataCard?: {
    constituency?: string;
    mp?: string;
    worksCount?: number;
    sanctionedCost?: string;
    spentCost?: string;
    completionRate?: string;
    status?: string;
  };
}

export const AIHelpdeskVoiceAssistant: React.FC<AIHelpdeskVoiceAssistantProps> = ({
  works = [],
  states = [],
  isHindi = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: isHindi
        ? "नमस्ते! मैं आपका MPLADS एआई वॉयस हेल्पडेस्क सहायक हूँ। आप बोलकर या लिखकर किसी भी राज्य, सांसद, या जिला (जैसे: गाजियाबाद, वाराणसी) के कार्यों के बारे में पूछ सकते हैं।"
        : "Namaste! I am your MPLADS AI Voice Helpdesk Assistant. Click the microphone or type any query to ask about MP assigned works, fund allocations, or state risks (e.g. 'How many MP works are assigned in Ghaziabad?').",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Speech Recognition Setup
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
          setInputText(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [isHindi]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your query in the input box.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputText("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = isHindi ? "hi-IN" : "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle Query Process
  const handleSendQuery = (queryText?: string) => {
    const textToProcess = queryText || inputText;
    if (!textToProcess.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Generate intelligent AI response based on keywords
    setTimeout(() => {
      const lower = textToProcess.toLowerCase();
      let responseText = "";
      let dataCardObj = undefined;

      if (lower.includes("ghaziabad") || lower.includes("गाजियाबाद")) {
        responseText = isHindi
          ? "गाजियाबाद (उत्तर प्रदेश) संसदीय क्षेत्र में सांसद श्री अतुल गर्ग के अंतर्गत कुल 38 कार्य स्वीकृत हैं। कुल स्वीकृत राशि ₹3.80 करोड़ है जिसमें से ₹2.84 करोड़ (57%) का व्यय हो चुका है। भौतिक प्रगति 68% है।"
          : "In Ghaziabad (Uttar Pradesh) constituency under Lok Sabha MP Shri Atul Garg, there are 38 sanctioned MPLADS works totaling ₹3.80 Cr in approved budget. ₹2.84 Cr (57%) has been spent with a 68% physical completion rate.";
        dataCardObj = {
          constituency: "Ghaziabad (UP)",
          mp: "Shri Atul Garg (Lok Sabha)",
          worksCount: 38,
          sanctionedCost: "₹3.80 Cr",
          spentCost: "₹2.84 Cr (57%)",
          completionRate: "68%",
          status: "Audit Flagged",
        };
      } else if (lower.includes("varanasi") || lower.includes("वाराणसी") || lower.includes("modi")) {
        responseText = isHindi
          ? "वाराणसी (उत्तर प्रदेश) संसदीय क्षेत्र में सांसद श्री नरेंद्र मोदी के अंतर्गत 42 विकास कार्य स्वीकृत हैं। कुल स्वीकृत राशि ₹4.50 करोड़ है तथा व्यय ₹4.38 करोड़ (88%) पूरा हो चुका है। भौतिक प्रगति 92% है।"
          : "In Varanasi (Uttar Pradesh) constituency under Prime Minister Shri Narendra Modi, 42 developmental works are sanctioned. Approved budget is ₹4.50 Cr, with ₹4.38 Cr (88%) disbursed and 92% completion rate.";
        dataCardObj = {
          constituency: "Varanasi (UP)",
          mp: "Shri Narendra Modi (Lok Sabha)",
          worksCount: 42,
          sanctionedCost: "₹4.50 Cr",
          spentCost: "₹4.38 Cr (88%)",
          completionRate: "92%",
          status: "Fully Compliant",
        };
      } else if (lower.includes("up") || lower.includes("uttar pradesh") || lower.includes("उत्तर प्रदेश")) {
        responseText = isHindi
          ? "उत्तर प्रदेश में कुल 2,481 एमपीएलएडीएस कार्य चालू हैं। कुल स्वीकृत राशि ₹22.5 करोड़ तथा व्यय ₹18.4 करोड़ है। औसत प्रगति दर 75% है।"
          : "Uttar Pradesh leads with 2,481 active MPLADS works across 80 Lok Sabha constituencies. Total sanctioned funds are ₹22.5 Cr with ₹18.4 Cr actual spent and 75% average completion rate.";
        dataCardObj = {
          constituency: "Uttar Pradesh (State)",
          mp: "80 Lok Sabha + 31 Rajya Sabha MPs",
          worksCount: 2481,
          sanctionedCost: "₹22.5 Cr",
          spentCost: "₹18.4 Cr",
          completionRate: "75%",
          status: "Active Surveillance",
        };
      } else {
        responseText = isHindi
          ? `आपके प्रश्न "${textToProcess}" के आधार पर: एमपीएलएडीएस राष्ट्रीय डेटाबेस में 12,842 कार्यों की वास्तविक समय निगरानी की जा रही है। 73.8% कार्य सुरक्षित क्षेत्र में हैं और 0.7% कार्य ऑडिट समीक्षा में हैं।`
          : `Based on your query "${textToProcess}": The MPLADS Sentinel AI surveillance system is monitoring 12,842 works across 28 states. 73.8% of works are in the green safety zone, with 87 critical outliers under immediate DM audit.`;
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        dataCard: dataCardObj,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(responseText);
    }, 600);
  };

  const sampleQueries = [
    "How many MP works are assigned in Ghaziabad?",
    "Show me Varanasi constituency fund progress",
    "What is the total expenditure in Uttar Pradesh?",
  ];

  return (
    <>
      {/* FLOATING ACTION TRIGGER BUTTON */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-navy-900 text-white rounded-full shadow-xl border border-blue-400/40 flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-saffron-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-extrabold tracking-wide hidden sm:inline">AI Voice Helpdesk</span>
      </motion.button>

      {/* MODAL DIALOG / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] max-h-[82vh] bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-800/80 border border-blue-400/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-saffron-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
                    MPLADS AI Voice Helpdesk
                  </h3>
                  <span className="text-[10px] text-blue-200/80 block font-mono">
                    Official Multilingual Voice Assistant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md text-[11px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Mute</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono rounded font-bold">
                    Online
                  </span>
                )}

                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AUDIO EQUALIZER WAVE BAR (WHEN SPEAKING / RECORDING) */}
            {(isSpeaking || isRecording) && (
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-2 flex items-center justify-between text-xs text-white border-b border-blue-800/50">
                <div className="flex items-center gap-2 font-mono">
                  {isRecording ? (
                    <>
                      <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                      <span className="text-red-300 font-bold">Listening... Speak now</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-saffron-400 animate-bounce" />
                      <span className="text-saffron-300 font-bold">Speaking Response</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-saffron-400 animate-pulse" />
                  <span className="w-1 h-5 bg-blue-400 animate-bounce" />
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse" />
                  <span className="w-1 h-4 bg-saffron-400 animate-bounce" />
                </div>
              </div>
            )}

            {/* CHAT MESSAGES BODY */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-saffron-400" />
                    </div>
                  )}

                  <div className="space-y-2 max-w-[84%]">
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed shadow-2xs ${
                        msg.sender === "user"
                          ? "bg-blue-900 text-white rounded-tr-none font-medium"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* DATA CARD FOR CONSTITUENCY ANSWERS */}
                      {msg.dataCard && (
                        <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono space-y-1 text-slate-800">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                            <strong className="text-blue-950">{msg.dataCard.constituency}</strong>
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px]">
                              {msg.dataCard.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>MP:</span>
                            <span className="font-sans font-bold text-slate-900">{msg.dataCard.mp}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Sanctioned Works:</span>
                            <span className="font-bold text-slate-900">{msg.dataCard.worksCount} Works</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Spent / Allocated:</span>
                            <span className="font-bold text-blue-900">{msg.dataCard.spentCost}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Completion Rate:</span>
                            <span className="font-bold text-emerald-700">{msg.dataCard.completionRate}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-mono">
                        <span>{msg.timestamp}</span>
                        {msg.sender === "ai" && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer flex items-center gap-0.5"
                          >
                            <Volume2 className="w-3 h-3" /> Listen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SAMPLE PROMPTS */}
            <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] text-slate-400 font-bold shrink-0 font-mono">Try:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(q)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 rounded-full border border-slate-200 whitespace-nowrap text-[10px] font-medium transition-colors cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* INPUT & VOICE RECORDING CONTROLS */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-500 text-white border-red-600 animate-pulse shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                }`}
                title="Click to Record Voice Query"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-blue-900" />}
              </button>

              <input
                type="text"
                placeholder={isRecording ? "Listening to your voice..." : "Ask AI or speak your query..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium"
              />

              <button
                type="button"
                onClick={() => handleSendQuery()}
                disabled={!inputText.trim()}
                className="p-2.5 bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
