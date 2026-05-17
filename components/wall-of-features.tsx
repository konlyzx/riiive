import React from "react";
import { 
  GitBranch, Search, CheckSquare, Network, Book, FileText, Calendar, CheckCircle, Folder, Briefcase,
  Bell, PieChart, Flag, CalendarClock, Target, Sparkles,
  Code, MapPin, ClipboardList, Zap, Edit, Clock,
  MessageSquare, ArrowUp, Calculator, Video, LayoutGrid, Key,
  Mail, BarChart2, Timer, Columns, Puzzle, UserPlus,
  Tag, PhoneCall, ListChecks, CalendarDays, Table, Monitor, AlignLeft, Route, Inbox, Users,
  Hash, Kanban
} from 'lucide-react';

const smallFeatures = [
  { name: "Dependencies", icon: GitBranch },
  { name: "Connected Search", icon: Search },
  { name: "Tasks", icon: CheckSquare },
  { name: "Mind Maps", icon: Network },
  { name: "Wikis", icon: Book },
  { name: "AI Notetaker", icon: FileText },
  { name: "Calendar", icon: Calendar },
  { name: "Proofing", icon: CheckCircle },
  { name: "Portfolios", icon: Folder },
  { name: "Templates", icon: Briefcase },

  { name: "Reminders", icon: Bell },
  { name: "Reporting", icon: PieChart },
  { name: "Goals", icon: Flag },
  { name: "Sprints", icon: CalendarClock },
  { name: "Custom Status", icon: Target },
  { name: "AI Writer", icon: Sparkles },

  { name: "API Calls", icon: Code },
  { name: "Milestones", icon: MapPin },
  { name: "Forms", icon: ClipboardList },
  { name: "Automations", icon: Zap },
  { name: "Custom Fields", icon: Edit },
  { name: "Timesheets", icon: Clock },

  { name: "AI Q&A", icon: MessageSquare },
  { name: "Priorities", icon: ArrowUp },
  { name: "Time Estimates", icon: Calculator },
  { name: "Clips", icon: Video },
  { name: "Everything view", icon: LayoutGrid },
  { name: "Single Sign-On", icon: Key },

  { name: "Emails", icon: Mail },
  { name: "Dashboards", icon: BarChart2 },
  { name: "Time Tracking", icon: Timer },
  { name: "Kanban Boards", icon: Columns },
  { name: "Integrations", icon: Puzzle },
  { name: "Guests", icon: UserPlus },

  { name: "Tags", icon: Tag },
  { name: "24/7 Support", icon: PhoneCall },
  { name: "Checklists", icon: ListChecks },
  { name: "Scheduling", icon: CalendarDays },
  { name: "Spreadsheets", icon: Table },
  { name: "Whiteboards", icon: Monitor },
  { name: "Gantt Charts", icon: AlignLeft },
  { name: "Roadmaps", icon: Route },
  { name: "Inbox", icon: Inbox },
  { name: "Teams", icon: Users },
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
      
      <div className="max-w-[1120px] mx-auto px-5 mb-16 text-center flex flex-col items-center relative z-20">
        <h2
          className="m-0 text-balance font-[650] text-4xl md:text-5xl leading-[1.25] tracking-tight mb-4"
          style={{
            background: "linear-gradient(97deg, rgb(255, 255, 255) 43.17%, rgb(150, 150, 150) 110.86%) text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
          }}
        >
          Everything you need <br className="hidden md:block" />
          to perfect your portfolio
        </h2>
        <p 
          className="text-lg font-light text-[#838383] tracking-tight"
          style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
        >
          AI-powered analysis, design feedback, and actionable insights to stand out.
        </p>
      </div>

      <div 
        className="relative mx-auto w-full max-w-[1381px]"
        style={{
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
        }}
      >
        <div className="grid grid-cols-10 grid-rows-6 gap-[1px] bg-white/10 p-[1px]">
          
          {/* Large tiles defined first so auto-placement avoids them */}
          
          <div className="col-start-4 col-span-2 row-start-2 row-span-2 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:bg-[#111]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <Kanban className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-light text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Projects</span>
            </div>
          </div>

          <div className="col-start-6 col-span-2 row-start-2 row-span-2 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:bg-[#111]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-light text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Docs</span>
            </div>
          </div>

          <div className="col-start-4 col-span-2 row-start-4 row-span-2 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:bg-[#111]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-light text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Brain</span>
            </div>
          </div>

          <div className="col-start-6 col-span-2 row-start-4 row-span-2 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:bg-[#111]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                <Hash className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-light text-white tracking-tight" style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}>Chat</span>
            </div>
          </div>

          {/* Small tiles */}
          {smallFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-white/5 transition-colors cursor-pointer group h-[120px]"
              >
                <Icon className="w-6 h-6 text-[#838383] group-hover:text-white transition-colors mb-3" strokeWidth={1.5} />
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
