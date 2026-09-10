import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export interface CaptchaInputProps {
  value: string;
  onChange: (val: string) => void;
  onCaptchaCodeGenerated?: (code: string) => void;
  error?: string;
}

export const CaptchaInput: React.FC<CaptchaInputProps> = ({
  value,
  onChange,
  onCaptchaCodeGenerated,
  error
}) => {
  const [captchaCode, setCaptchaCode] = useState<string>("");

  const generateCaptcha = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    if (onCaptchaCodeGenerated) {
      onCaptchaCodeGenerated(code);
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">
        Enter Captcha <span className="text-red-600">*</span>
      </label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Captcha Box & Refresh */}
        <div className="flex items-center gap-2">
          <div className="h-10 px-4 bg-slate-100 border border-slate-300 rounded-md flex items-center justify-center select-none shadow-inner relative overflow-hidden min-w-[130px]">
            {/* Background noise lines */}
            <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_8px)]" />
            <span
              className="font-mono text-lg font-bold text-slate-800 tracking-[0.3em] italic transform -skew-x-6 select-none relative z-10"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
            >
              {captchaCode}
            </span>
          </div>

          <button
            type="button"
            onClick={generateCaptcha}
            title="Refresh Captcha"
            aria-label="Refresh Captcha Code"
            className="w-10 h-10 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Captcha Input */}
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type code shown"
            maxLength={6}
            required
            className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
              error ? "border-red-500 focus:ring-red-500" : "border-slate-300"
            }`}
          />
        </div>
      </div>
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  );
};
