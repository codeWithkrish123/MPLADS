import React from "react";
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink, Globe2, Eye, Award, ChevronRight } from "lucide-react";
import { Language } from "../../types";

interface GovFooterProps {
  language: Language;
}

export const GovFooter: React.FC<GovFooterProps> = ({ language }) => {
  const isHindi = language === "hi";

  return (
    <footer className="bg-white text-[#111827] border-t border-[#E5E7EB] mt-16 font-sans select-none shadow-xs">
      {/* Top Decorative Bar: National Tricolor Stripe */}
      <div className="india-gov-tricolor-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Government Branding (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              {/* Circular badge/avatar with pale red/pink background matching the top directory badge */}
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#E31E24] font-extrabold text-sm tracking-wider">
                IN
              </div>
              <div>
                <h4 className="font-semibold text-[#111827] text-[15px] font-heading leading-snug">
                  {isHindi ? "सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय" : "Ministry of Statistics & PI"}
                </h4>
                <p className="text-[11px] text-[#6B7280]">
                  {isHindi ? "भारत सरकार" : "Government of India"}
                </p>
              </div>
            </div>
            
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {isHindi
                ? "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) आम नागरिक पारदर्शिता एवं एआई-संचालित निगरानी पोर्टल।"
                : "MPLADS e-Passbook & AI Surveillance Portal ensuring transparent public development for all 543 constituencies."}
            </p>

            {/* Pill badges with rounded-full, 1px border in badge's color, and pale background */}
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                GIGW Compliant
              </span>
              <span className="rounded-full border border-emerald-200 bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                STQC Certified
              </span>
            </div>
          </div>

          {/* Col 2: National Government Portals (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-sans font-semibold text-[#111827] text-[12px] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#2563EB]" />
              <span>{isHindi ? "राष्ट्रीय पोर्टल" : "National Portals"}</span>
            </h4>
            <ul className="space-y-2.5 pt-3 text-[12px]">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#E31E24] flex items-start gap-2.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>National Portal of India (India.gov.in)</span>
                </a>
              </li>
              <li>
                <a href="https://igod.gov.in" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#E31E24] flex items-start gap-2.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>IGOD — Govt Online Directory</span>
                </a>
              </li>
              <li>
                <a href="https://umang.gov.in" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#E31E24] flex items-start gap-2.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>UMANG Services App</span>
                </a>
              </li>
              <li>
                <a href="https://parivahan.gov.in" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#E31E24] flex items-start gap-2.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>Parivahan Driving &amp; Vehicle Portal</span>
                </a>
              </li>
              <li>
                <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#E31E24] flex items-start gap-2.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>DigiLocker Digital Documents</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Aam Nagarik Citizen Services (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-sans font-semibold text-[#111827] text-[12px] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>{isHindi ? "आम नागरिक सेवाएँ" : "Aam Nagarik Services"}</span>
            </h4>
            <ul className="space-y-2.5 pt-3 text-[12px]">
              <li className="flex items-start gap-2.5 text-[#6B7280]">
                <ChevronRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{isHindi ? "संसदीय विकास कार्य खोज" : "Track MP Fund Projects"}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#6B7280]">
                <ChevronRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{isHindi ? "एमपी निधि ई-पासबुक डाउनलोड" : "Download MP Expenditure Passbook"}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#6B7280]">
                <ChevronRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{isHindi ? "सड़क एवं पेयजल कार्य जीपीएस फोटो" : "View Geo-Tagged Work Photos"}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#6B7280]">
                <ChevronRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{isHindi ? "लागत में देरी व शिकायत निवारण" : "File Project Delays & Grievance"}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#6B7280]">
                <ChevronRight className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                <span>{isHindi ? "आस्क सांसद निधि एआई सहायता" : "Ask MPLADS AI 24x7 Assistant"}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Citizen Support (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-sans font-semibold text-[#111827] text-[12px] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#2563EB]" />
              <span>{isHindi ? "नागरिक सहायता एवं संपर्क" : "Citizen Support & Address"}</span>
            </h4>
            <div className="space-y-3 pt-3 text-[12px]">
              <div className="flex items-start gap-2.5 text-[#6B7280]">
                <MapPin className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                <span>
                  MoSPI, Khurshid Lal Bhawan, Janpath, New Delhi - 110001
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827] font-semibold">
                <PhoneCall className="w-4 h-4 text-[#E31E24] shrink-0" />
                <span>Toll Free: 1800-11-1992</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#6B7280]">
                <Mail className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span>support-mplads@nic.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Visitor Counter & Legal Copyright */}
        <div className="pt-6 border-t border-[#E5E7EB] flex flex-col lg:flex-row items-center justify-between text-[12px] text-[#6B7280] gap-4">
          <div className="flex flex-wrap items-center gap-2 text-center lg:text-left justify-center lg:justify-start">
            <span>
              © 2026 {isHindi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार" : "Ministry of Statistics & PI, Government of India."}
            </span>
            <span className="hidden lg:inline text-[#9CA3AF]">•</span>
            <span className="text-[#9CA3AF]">
              {isHindi ? "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा विकसित व होस्टेड" : "Designed, Developed & Hosted by National Informatics Centre (NIC)"}
            </span>
          </div>

          {/* Bordered Stat Pill on the Right */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-4 py-1.5 text-[11px] font-sans">
            <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
            <span className="text-[#6B7280]">{isHindi ? "कुल विज़िटर्स:" : "Total Visitors:"}</span>
            <span className="font-semibold text-[#111827] tabular-nums">18,492,038</span>
            <span className="text-[#E5E7EB]">|</span>
            <span className="text-[#6B7280]">{isHindi ? "अंतिम अद्यतन:" : "Last Updated:"}</span>
            <span className="font-semibold text-[#111827]">26 Aug 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
