import React from "react";
import { 
  Eye, Search, Star, Layout, FileText, Sparkles, Globe, CheckCircle, Folder, Layers,
  Bell, BarChart, Target, TrendingUp, Award, Zap,
  Code, MapPin, ClipboardList, Lightbulb, Edit, Clock,
  MessageSquare, ArrowUp, Calculator, Video, LayoutGrid, Key,
  Mail, PieChart, Timer, Columns, Puzzle, UserPlus,
  Tag, Phone, ListChecks, Calendar, Table, Monitor, AlignLeft, Route, Inbox, Users,
  Hash, Briefcase
} from 'lucide-react';

const smallFeatures = [
  { name: "Design Review", icon: Eye },
  { name: "SEO Analysis", icon: Search },
  { name: "Case Studies", icon: Star },
  { name: "Layout Testing", icon: Layout },
  { name: "Documentation", icon: FileText },
  { name: "AI Insights", icon: Sparkles },
  { name: "Global Reach", icon: Globe },
  { name: "Quality Check", icon: CheckCircle },
  { name: "Portfolios", icon: Folder },
  { name: "Templates", icon: Layers },

  { name: "Notifications", icon: Bell },
  { name: "Analytics", icon: BarChart },
  { name: "Goal Tracking", icon: Target },
  { name: "Performance", icon: TrendingUp },
  { name: "Achievements", icon: Award },
  { name: "AI Assistant", icon: Zap },

  { name: "Code Review", icon: Code },
  { name: "Milestones", icon: MapPin },
  { name: "Feedback Forms", icon: ClipboardList },
  { name: "Smart Suggestions", icon: Lightbulb },
  { name: "Custom Design", icon: Edit },
  { name: "History", icon: Clock },

  { name: "Q&A", icon: MessageSquare },
  { name: "Top Features", icon: ArrowUp },
  { name: "Metrics", icon: Calculator },
  { name: "Screen Recording", icon: Video },
  { name: "Grid View", icon: LayoutGrid },
  { name: "Secure Access", icon: Key },

  { name: "Contact", icon: Mail },
  { name: "Statistics", icon: PieChart },
  { name: "Response Time", icon: Timer },
  { name: "Categories", icon: Columns },
  { name: "Integrations", icon: Puzzle },
  { name: "Collaboration", icon: UserPlus },

  { name: "Tags", icon: Tag },
  { name: "Support", icon: Phone },
  { name: "Checklists", icon: ListChecks },
  { name: "Schedule", icon: Calendar },
  { name: "Data Export", icon: Table },
  { name: "Preview", icon: Monitor },
  { name: "Typography", icon: AlignLeft },
  { name: "Navigation", icon: Route },
  { name: "Messages", icon: Inbox },
  { name: "Team", icon: Users },
];

export default function WallOfFeatures() {
  return (
    <div className="w-full overflow-hidden pb-32 pt-20 bg-black relative">
      {/* Top fade gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)"
        }}
      />
      
      <div className="max-w-[1120px] mt-15 mx-auto px-5 mb-16 text-center flex flex-col items-center relative z-20">
      </div>

      <div 
        className="relative mx-auto w-full max-w-[1381px]"
        style={{
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
        }}
      >
        <div className="grid grid-cols-10 grid-rows-6 gap-[1px] bg-white/10 p-[1px]">
          
          <div className="col-start-4 col-span-2 row-start-2 row-span-2 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent" />

            <div className="relative z-10 flex items-center gap-3 mt-auto mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Briefcase className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Portfolios</span>
            </div>
          </div>

          <div className="col-start-6 col-span-2 row-start-2 row-span-2 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden cursor-pointer">
            {/* Manual gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent" />

            <div className="relative z-10 flex items-center gap-3 mt-auto mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <FileText className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Case Studies</span>
            </div>
          </div>

          <div className="col-start-4 col-span-2 row-start-4 row-span-2 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden cursor-pointer">
            {/* Manual gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent" />

            <div className="relative z-10 flex items-center gap-3 mt-auto mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>AI Analysis</span>
            </div>
          </div>

          <div className="col-start-6 col-span-2 row-start-4 row-span-2 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden cursor-pointer">
            {/* Manual gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent" />

            <div className="relative z-10 flex items-center gap-3 mt-auto mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <MessageSquare className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Feedback</span>
            </div>
          </div>

          {/* Small tiles */}
          {smallFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-white/10 transition-all duration-300 cursor-pointer group h-[120px] hover:scale-[1.02] relative z-10"
              >
                <Icon className="w-6 h-6 text-[#838383] group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-3" strokeWidth={1.5} />
                <span className="text-[13px] font-light text-[#838383] group-hover:text-white transition-colors text-center px-2 leading-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>
                  {feature.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
