import PostAnnouncementButton from "@/components/page-components/announcements/PostAnnouncementButton";
import SectionWrapper from "@/components/general/SectionWrapper";
import AnnouncementList from "@/components/page-components/announcements/AnnouncementList";
import SortAnnouncement from "@/components/page-components/announcements/SortAnnouncement";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function Announcements() {
  const { t, i18n } = useTranslation("announcements");
  const { state: authState } = useFullUserContext();
  const isAuth = !!authState.account_id;

  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

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

        {/* Modern Ambient Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-main to-primary-main-light p-8 md:p-12 shadow-xl border border-primary-main-light/20 text-white w-full animate-[fadeSlideUp_0.4s_ease-out]">
          {/* Decorative ambient glowing blur rings */}
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none animate-bounce" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4 border border-white/10 shadow-sm">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Community Updates
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 font-roboto bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
                {t("subtext")}
              </p>
            </div>
            <div className="flex-shrink-0 self-start md:self-center hidden sm:block animate-float">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Leaf className="w-10 h-10 text-emerald-200" />
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

            {/* Sub-toolbar with Feed Filters & Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100/80 gap-4">
              <div className="flex flex-1 items-center gap-4 w-full">


                {/* Search Bar */}
                <div className="relative flex-1 w-full max-w">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                  />
                  {localSearch && (
                    <button
                      onClick={() => setLocalSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <SortAnnouncement />
              </div>
            </div>

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

            {/* Widget 3: Quick Links */}
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-28 h-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
              <h4 className="font-extrabold text-sm mb-1 text-emerald-300">
                {currentLang === "tl" ? "Handa na Mag-recycle?" : "Ready to Recycle?"}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                {currentLang === "tl"
                  ? "Subaybayan ang iyong mga naiambag na rice waste at kumuha ng mga gantimpala agad."
                  : "Track your active rice waste contributions and earn rewards instantly."}
              </p>
              {isAuth ? (
                <a
                  href="/home"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors group cursor-pointer"
                >
                  {currentLang === "tl" ? "Subaybayan ang Iyong Impact" : "Track Your Impact"}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <RequiredAuthPopup>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors group cursor-pointer text-left"
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
