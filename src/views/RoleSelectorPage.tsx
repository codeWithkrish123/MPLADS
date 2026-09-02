import React from "react";
import { Landmark, MapPin, Building2, Globe2, ArrowRight, Shield, CheckCircle2, Lock } from "lucide-react";
import { UserRole } from "../types";

interface RoleSelectorPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectorPage: React.FC<RoleSelectorPageProps> = ({
  onSelectRole,
}) => {
  const roles: {
    id: UserRole;
    title: string;
    description: string;
    icon: typeof Landmark;
    badge: string;
    scope: string;
    features: string[];
  }[] = [
    {
      id: "Member of Parliament",
      title: "Member of Parliament",
      description: "Track recommended works, sanction milestones and constituency-level development performance.",
      icon: Landmark,
      badge: "Constituency Scope",
      scope: "Authorized Lok Sabha / Rajya Sabha Constituency",
      features: [
        "Annual Entitlement (₹5 Cr) draw tracking",
        "Sanction status of recommended works",
        "At-risk project alerts in catchment",
      ],
    },
    {
      id: "District Authority",
      title: "District Authority / DM",
      description: "Monitor implementation, expenditure tranches, contractor backlog and field inspection risks.",
      icon: MapPin,
      badge: "District Scope",
      scope: "District Planning & Monitoring Cell",
      features: [
        "Real-time physical vs financial divergence",
        "Third-party technical audit assignments",
        "Statutory MB & geotag compliance verification",
      ],
    },
    {
      id: "State Nodal Authority",
      title: "State Nodal Authority",
      description: "Compare districts, benchmark implementing agencies, and oversee inter-departmental fund velocity.",
      icon: Globe2,
      badge: "State Scope",
      scope: "State Planning & Rural Development Department",
      features: [
        "Cross-district risk ranking & heatmaps",
        "Agency portfolio risk & cost overrun index",
        "Multi-district comparative analytics (2-5 districts)",
      ],
    },
    {
      id: "Ministry",
      title: "Ministry of Statistics & PI",
      description: "National-level intelligence, macroeconomic expenditure trends, cross-state anomaly clusters and compliance.",
      icon: Building2,
      badge: "National Scope",
      scope: "Union Ministry / MoSPI MPLADS Division",
      features: [
        "National Geographic Risk GIS Map (28 States & UTs)",
        "Near-duplicate pattern identification across borders",
        "Statutory guideline revision & policy enforcement",
      ],
    },
    {
      id: "Citizen",
      title: "Citizen & Social Auditor",
      description: "Explore localized works in your village or constituency, verify geo-tagged photos, and report delays.",
      icon: Landmark,
      badge: "Public Transparency Scope",
      scope: "All India Citizen Transparency Portal",
      features: [
        "Interactive Constituency Work Locator",
        "Public Expenditure & Geo-tagged Photo Inspection",
        "Direct CPGRAMS Grievance & Anomaly Lodging",
      ],
    },
  ];

  return (
    <div
      id="role-selector-page"
      className="min-h-screen flex flex-col justify-between px-4 py-8 sm:py-12 bg-[#F4F7FA] text-[#1A1A2E]"
    >
      {/* Top Header Controls */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#E1E6EB]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-[#0B4F8A] text-white shadow-xs">
            🏛️
          </div>
          <div>
            <span className="text-sm font-bold font-heading text-[#0B4F8A]">
              MPLADS Sentinel GovID SSO Gate
            </span>
            <div className="text-[11px] text-[#5A6572]">Ministry of Statistics and Programme Implementation</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#138808]/10 text-[#138808] border border-[#138808]/30 rounded text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> NIC GovID Active
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full my-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0B4F8A] border border-blue-200 text-xs font-semibold rounded-md">
            <Lock className="w-3.5 h-3.5" /> Designated Authority Portal Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1A1A2E]">
            Select Your Authorized Governance Role
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6572] max-w-2xl mx-auto">
            Each role presents a tailored workspace configured for specific statutory permissions, decision support tools, and analytical scopes.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {roles.map((r) => {
            const IconComp = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className="bg-white p-6 rounded-lg border border-[#E1E6EB] hover:border-[#0B4F8A] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-md bg-[#0B4F8A]/10 text-[#0B4F8A] group-hover:bg-[#0B4F8A] group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-[#5A6572] text-[11px] font-semibold">
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-heading text-[#1A1A2E] group-hover:text-[#0B4F8A] transition-colors">
                      {r.title}
                    </h3>
                    <div className="text-xs text-[#0B4F8A] font-medium mt-0.5">
                      {r.scope}
                    </div>
                    <p className="text-xs text-[#5A6572] mt-2 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-[#E1E6EB]">
                    {r.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#5A6572]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center justify-between text-xs font-semibold text-[#0B4F8A]">
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full pt-6 border-t border-[#E1E6EB] text-center text-xs text-[#5A6572]">
        Government of India • Ministry of Statistics and Programme Implementation (MoSPI) • NIC Sentinel v2.6.4
      </div>
    </div>
  );
};
