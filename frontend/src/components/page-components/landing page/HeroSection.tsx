import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Leaf, Recycle, Sprout, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import GetStartedButton from "./GetStartedButton";
import heroImage1 from "@/assets/participating.webp";
import heroImage2 from "@/assets/weighing.webp";
import heroImage3 from "@/assets/reward.webp";

gsap.registerPlugin(ScrollTrigger);

const statsMeta = [
  { value: 500, suffix: "+", labelKey: "hero.stat_households", icon: Users },
  { value: 2000, suffix: "kg", labelKey: "hero.stat_collected", icon: Recycle },
  { value: 1.2, suffix: "t", labelKey: "hero.stat_co2", icon: Sprout, isDecimal: true },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const statCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.6 + i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function HeroSection() {
  const { t } = useTranslation("landing_page");
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const title = t("hero.title");
  const titleWords = title.split(" ");
  const rightRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blob1Ref.current) {
        gsap.to(blob1Ref.current, {
          y: 120, x: -40, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
        });
      }
      if (blob2Ref.current) {
        gsap.to(blob2Ref.current, {
          y: -100, x: 50, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
        });
      }
      if (blob3Ref.current) {
        gsap.to(blob3Ref.current, {
          y: 80, x: -60, scale: 1.3, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 2 },
        });
      }

      const particles = particlesRef.current?.children;
      if (particles) {
        Array.from(particles).forEach((particle) => {
          gsap.to(particle, {
            x: gsap.utils.random(30, 60),
            y: gsap.utils.random(-30, 30),
            rotation: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(4, 7),
            repeat: -1, yoyo: true, ease: "sine.inOut",
          });
        });
      }

      if (counterRef.current) {
        const els = counterRef.current.querySelectorAll<HTMLElement>("[data-counter]");
        const tl = gsap.timeline({ delay: 1.2 });
        els.forEach((el) => {
          const target = parseFloat(el.getAttribute("data-target") || "0");
          const isDecimal = el.getAttribute("data-decimal") === "true";
          const suffix = el.getAttribute("data-suffix") || "";
          const obj = { val: 0 };
          tl.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              const display = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString();
              el.textContent = display + suffix;
            },
          }, "-=1.5");
        });
      }

      if (rightRef.current) {
        gsap.to(rightRef.current, {
          y: -20, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative w-full min-h-[calc(100dvh-80px)] bg-warm-cream overflow-hidden flex items-center"
    >
      <div
        ref={blob1Ref}
        className="absolute -top-40 -right-40 w-[600px] max-sm:w-[300px] max-sm:-right-20 max-sm:-top-20 h-[600px] max-sm:h-[300px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary-main/10 blur-[100px] pointer-events-none"
      />
      <div
        ref={blob2Ref}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-warm-tan/30 blur-[80px] pointer-events-none max-sm:hidden"
      />
      <div
        ref={blob3Ref}
        className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-[50%_50%_60%_40%/40%_60%_50%_50%] bg-primary-main-light/10 blur-[60px] pointer-events-none max-sm:hidden"
      />

      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none z-10"
      >
        <Leaf className="absolute top-[15%] left-[8%] w-6 h-6 text-primary-main/20 max-sm:hidden" />
        <Recycle className="absolute top-[25%] right-[12%] w-8 h-8 text-primary-main/15 max-sm:hidden" />
        <Sprout className="absolute bottom-[30%] left-[12%] w-5 h-5 text-primary-main/20 max-sm:hidden" />
        <Leaf className="absolute bottom-[20%] right-[10%] w-7 h-7 text-primary-main/15 max-sm:hidden" />
      </div>

      <motion.div
        className="relative z-20 max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 py-20 max-lg:py-16 max-md:py-12 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-16 max-lg:gap-12 items-center">
          <div>
            <h1 className="text-5xl max-lg:text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-secondary-dark leading-[1.15] tracking-tight overflow-hidden">
              {titleWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    variants={wordVariants}
                    custom={i}
                  >
                    {word}
                  </motion.span>
                  {i < titleWords.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-6 text-secondary-dark/60 text-lg max-lg:text-base leading-relaxed max-w-xl"
            >
              {t("hero.subtext")}
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="flex gap-3 mt-8 max-sm:flex-col"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <GetStartedButton className="px-6 py-5 text-sm font-semibold" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={() => navigate("/#how-does-it-work")}
                  className="px-6 py-5 text-sm font-semibold group bg-transparent border border-secondary-dark/20 text-secondary-dark hover:bg-secondary-dark hover:text-white hover:border-secondary-dark"
                  variant="outline"
                >
                  {t("hero.button.how_does_it_work")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              ref={counterRef}
              className="flex gap-8 mt-14 pt-8 border-t border-warm-tan/50 max-sm:gap-4 max-sm:flex-wrap"
              variants={fadeUpVariants}
            >
              {statsMeta.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.labelKey}
                    className="flex items-center gap-3 cursor-default"
                    variants={statCardVariants}
                    custom={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-main" />
                    </div>
                    <div>
                      <p
                        className="text-2xl max-sm:text-xl font-bold text-secondary-dark"
                        data-counter
                        data-target={stat.value}
                        data-suffix={stat.suffix}
                        data-decimal={stat.isDecimal ? "true" : "false"}
                      >
                        0{stat.suffix}
                      </p>
                      <p className="text-xs text-secondary-dark/50 uppercase tracking-wide">
                        {t(stat.labelKey)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div ref={rightRef} className="max-lg:hidden">
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="space-y-6">
                <motion.div
                  ref={img1Ref}
                  className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-warm-beige shadow-2xl shadow-primary-main/10 border-4 border-white/50"
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                  transition={{
                    delay: 1.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94],
                    y: { delay: 1.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <img
                    src={heroImage1}
                    alt={t("hero.image_alt_1")}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="space-y-6 pt-12">
                <motion.div
                  ref={img2Ref}
                  className="aspect-square rounded-[2rem] overflow-hidden bg-warm-beige shadow-xl shadow-primary-main/10 border-4 border-white/50"
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                  transition={{
                    delay: 1.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94],
                    y: { delay: 1.7, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <img
                    src={heroImage2}
                    alt={t("hero.image_alt_2")}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  ref={img3Ref}
                  className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-warm-beige shadow-lg shadow-primary-main/10 border-4 border-white/50"
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                  transition={{
                    delay: 1.9, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94],
                    y: { delay: 1.9, duration: 5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <img
                    src={heroImage3}
                    alt={t("hero.image_alt_3")}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
