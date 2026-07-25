import PostAnnouncementButton from "@/components/page-components/announcements/PostAnnouncementButton";
import SectionWrapper from "@/components/general/SectionWrapper";
import AnnouncementList from "@/components/page-components/announcements/AnnouncementList";
import SortAnnouncement from "@/components/page-components/announcements/SortAnnouncement";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Leaf,
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  Droplet,
  Trash2,
  Zap,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from "lucide-react";
import ecoTipsData from "@/assets/eco_tips.json";
import useFullUserContext from "@/hooks/useFullUserContext";
import RequiredAuthPopup from "@/components/general/RequiredAuthPopup";
import { FLARE_OPTIONS, FLARES } from "@/lib/flares";

export default function Announcements() {
  const { t, i18n } = useTranslation("announcements");
  const { state: authState } = useFullUserContext();
  const isAuth = !!authState.account_id;

  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
  const activeFlare = searchParams.get("flare") || "";

  const handleFlareClick = (flareName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!flareName) {
      newParams.delete("flare");
    } else {
      if (activeFlare === flareName) {
        newParams.delete("flare");
      } else {
        newParams.set("flare", flareName);
      }
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  // Sync input value when URL query params change
  useEffect(() => {
    setLocalSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounced sync of search text with searchParams
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

    const timer = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (localSearch) {
        newSearchParams.set("search", localSearch);
      } else {
        newSearchParams.delete("search");
      }
      setSearchParams(newSearchParams, { replace: true, preventScrollReset: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchParams, setSearchParams]);

  const [activeTipIdx, setActiveTipIdx] = useState(0);
  const [shuffledTips, setShuffledTips] = useState<any[]>([]);

  // Shuffle tips on mount
  useEffect(() => {
    const tips = [...ecoTipsData];
    for (let i = tips.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tips[i], tips[j]] = [tips[j], tips[i]];
    }
    setShuffledTips(tips);
  }, []);

  // Rotate tips every 15 seconds
  useEffect(() => {
    if (shuffledTips.length === 0) return;
    const interval = setInterval(() => {
      setActiveTipIdx((prev) => (prev + 1) % shuffledTips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [shuffledTips, activeTipIdx]);

  const currentLang = i18n.language || "en";
  const activeTip = shuffledTips[activeTipIdx] || ecoTipsData[0];
  const tipTitle = activeTip ? (currentLang === "tl" ? activeTip.title_tl : activeTip.title_en) : "";
  const tipText = activeTip ? (currentLang === "tl" ? activeTip.text_tl : activeTip.text_en) : "";

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "rice":
        return <Leaf className="w-4 h-4 text-emerald-500" />;
      case "water":
        return <Droplet className="w-4 h-4 text-sky-500" />;
      case "plastic":
        return <Trash2 className="w-4 h-4 text-rose-500" />;
      case "compost":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "energy":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <SectionWrapper className="items-start justify-center min-h-screen bg-slate-50/50 pb-20" id="announcements">
      <Helmet>
        <title>Announcements | Rise to Rice</title>
        <meta
          name="description"
          content="Stay up to date with our latest news and announcements from Rise to Rice."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/announcements" />

        <meta property="og:title" content="Announcements — Rise to Rice" />
        <meta
          property="og:description"
          content="Stay up to date with our latest news and announcements from Rise to Rice."
        />
        <meta
          property="og:url"
          content="https://risetorice.com/announcements"
        />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Modern Ambient Hero Banner - Balanced Sage-Green Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E8F4E5] to-[#D5ECD0]/70 p-8 md:p-12 border border-[#2D5A27]/15 shadow-sm w-full animate-[fadeSlideUp_0.4s_ease-out]">
          {/* Decorative Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A27]/10 text-xs font-bold uppercase tracking-wider text-[#2D5A27] mb-4 border border-[#2D5A27]/20 shadow-sm">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Community Updates
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 font-roboto text-[#2D5A27]">
                {t("title")}
              </h1>
              <p className="text-[#2D5A27]/85 font-medium text-sm sm:text-base leading-relaxed max-w-xl">
                {t("subtext")}
              </p>
            </div>
            <div className="flex-shrink-0 self-start md:self-center hidden sm:block animate-float">
              <div className="w-20 h-20 rounded-2xl bg-[#2D5A27] flex items-center justify-center shadow-md">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 70/30 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start w-full">

          {/* Left Column: Feed Content */}
          <div className="flex flex-col gap-6 w-full">

            {/* Post Announcement Component (Admins) */}
            <PostAnnouncementButton />

            {/* Search + Sort Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full animate-[fadeSlideUp_0.3s_ease-out]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#2D5A27]/15 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <SortAnnouncement />
            </div>

            {/* Flares Row - Horizontal Scrollable via Shadcn ScrollArea */}
            <ScrollArea className="w-full max-w-3xl whitespace-nowrap pb-2 animate-[fadeSlideUp_0.35s_ease-out]">
              <div className="flex flex-row flex-nowrap items-center gap-1.5 w-full">
                <button
                  onClick={() => handleFlareClick("")}
                  className={`shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 active:scale-95 ${!activeFlare
                    ? "bg-[#2D5A27] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 bg-slate-50/50 border border-slate-100"
                    }`}
                >
                  All
                </button>
                {FLARE_OPTIONS.map((flare) => {
                  const config = FLARES[flare];
                  const Icon = config.icon;
                  const isActive = activeFlare === flare;
                  return (
                    <button
                      key={flare}
                      onClick={() => handleFlareClick(flare)}
                      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 active:scale-95 border ${isActive
                        ? config.active + " border-transparent"
                        : config.filterInactive + " border-slate-100 bg-slate-50/50"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label[currentLang === "tl" ? "tl" : "en"]}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Main Announcements Feed */}
            <AnnouncementList />
          </div>

          {/* Right Column: Premium Interactive Sidebar widgets */}
          <aside className="flex flex-col gap-6 w-full lg:sticky lg:top-24 max-lg:hidden">

            {/* Widget 1: Eco-Insight Slider */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Eco Tips & Insights</h3>
              </div>

              <div className="min-h-[140px] flex flex-col justify-between">
                <div key={activeTipIdx} className="animate-[fadeSlideUp_0.3s_ease-out] flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-xs font-bold text-emerald-700 mb-1 w-fit select-none uppercase tracking-wide">
                    {getCategoryIcon(activeTip.category)}
                    {tipTitle}
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {tipText}
                  </p>
                </div>

                <div className="flex items-center justify-end mt-4 border-t border-slate-50 pt-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveTipIdx((prev) => (prev - 1 + (shuffledTips.length || ecoTipsData.length)) % (shuffledTips.length || ecoTipsData.length))}
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-500 hover:text-emerald-600 shadow-sm"
                      aria-label="Previous tip"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTipIdx((prev) => (prev + 1) % (shuffledTips.length || ecoTipsData.length))}
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-500 hover:text-emerald-600 shadow-sm"
                      aria-label="Next tip"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Quick Links - Balanced Sage-Green Theme */}
            <div className="relative bg-gradient-to-br from-[#E8F4E5] to-[#D5ECD0]/70 p-6 rounded-2xl border border-[#2D5A27]/15 shadow-sm overflow-hidden">
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>

              <h4 className="font-bold text-sm mb-1.5 text-[#2D5A27]">
                {currentLang === "tl" ? "Handa na Mag-recycle?" : "Ready to Recycle?"}
              </h4>
              <p className="text-xs text-[#2D5A27]/85 font-medium leading-relaxed mb-4">
                {currentLang === "tl"
                  ? "Subaybayan ang iyong mga naiambag na rice waste at kumuha ng mga gantimpala agad."
                  : "Track your active rice waste contributions and earn rewards instantly."}
              </p>
              {isAuth ? (
                <a
                  href="/home"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A27] hover:text-[#1E3B1A] transition-colors group cursor-pointer"
                >
                  {currentLang === "tl" ? "Subaybayan ang Iyong Impact" : "Track Your Impact"}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <RequiredAuthPopup>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A27] hover:text-[#1E3B1A] transition-colors group cursor-pointer text-left"
                  >
                    {currentLang === "tl" ? "Subaybayan ang Iyong Impact" : "Track Your Impact"}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </RequiredAuthPopup>
              )}
            </div>

          </aside>

        </div>
      </div>
    </SectionWrapper>
  );
}
