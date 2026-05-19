import InputText from "@/components/general/InputText";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useFullUserContext from "@/hooks/useFullUserContext";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ContactUs as ContactUsType,
  ContactUsSchema,
} from "@/schema/ContactUs";
import { ContactUsSchema as ContactUsSchemaTL } from "@/schema/tl/ContactUs";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/components/general/Loading";
import { toast } from "sonner";
import { formatZodErrors } from "@/lib/format";
import { ZodError } from "zod";
import ZodErrorDisplay from "@/components/general/ZodErrorDisplay";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, ArrowRight, Facebook } from "lucide-react";

export default function ContactUs() {
  const { t, i18n } = useTranslation("contact_us");

  const { state } = useFullUserContext();
  const [error, setError] = useState<string[]>([]);

  const parser = i18n.language === "en" ? ContactUsSchema : ContactUsSchemaTL;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactUsType) => {
      await axios.post("/api/contact-us", data, {
        withCredentials: true,
      });
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.");
    },
    onSuccess: () => {
      toast.success(
        <span className="text-green-500 flex flex-col">
          {t("toast.success_message")}
          <span className="text-foreground">{t("toast.description")}</span>
        </span>
      );
      if (messageRef.current) {
        messageRef.current.value = "";
      }
    },
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.first_name && firstNameRef.current) {
      firstNameRef.current.value = state.first_name;
    }

    if (state.email && emailRef.current) {
      emailRef.current.value = state.email;
    }

    if (state.last_name && lastNameRef.current) {
      lastNameRef.current.value = state.last_name;
    }
  }, [state]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    try {
      const parsedData = parser.parse({
        first_name: firstNameRef.current?.value,
        last_name: lastNameRef.current?.value,
        email: emailRef.current?.value,
        message: messageRef.current?.value,
      });

      mutate(parsedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        setError(errors);
      }
    }
  };

  return (
    <SectionWrapper
      id="contact-us"
      className="flex-col py-24 max-lg:py-20 max-md:py-16 bg-warm-cream"
    >
      <Helmet>
        <title>Contact Us | Rise to Rice</title>
        <meta
          name="description"
          content="Get in touch with the Rise to Rice team for support, questions, or feedback."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://risetorice.com/contact-us" />

        <meta property="og:title" content="Contact Us — Rise to Rice" />
        <meta
          property="og:description"
          content="Get in touch with our team for inquiries, feedback, or collaboration opportunities."
        />
        <meta property="og:url" content="https://risetorice.com/contact-us" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>

      <div className="max-w-screen-xl mx-auto px-20 max-lg:px-10 max-sm:px-6 w-full">
        {/* Header Section */}
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main text-xs font-extrabold uppercase tracking-widest bg-primary-muted border border-warm-tan/30 rounded-full px-4 py-1.5 shadow-sm inline-block">
            Get In Touch
          </span>
          <h1 className="mt-5 text-5xl max-lg:text-4xl max-md:text-3xl font-extrabold text-secondary-dark tracking-tight leading-none">
            {t("header")}
          </h1>
          <p className="mt-4 text-secondary-dark/60 text-base max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-7 w-full">
            <form
              className="flex flex-col gap-6 bg-white p-10 max-md:p-8 rounded-3xl border border-warm-tan/20 shadow-sm hover:shadow-md transition-shadow duration-300 w-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputText
                    ref={firstNameRef}
                    label={t("form.first_name")}
                    name="first_name"
                    type="text"
                    inputClassName="max-md:text-sm max-sm:text-xs bg-warm-cream/30 border-warm-tan/30 focus-visible:ring-primary-main/20 focus-visible:border-primary-main rounded-xl transition-all"
                    labelClassname="text-sm font-semibold text-secondary-dark/80"
                    defaultValue={state.first_name}
                  />
                  <InputText
                    ref={lastNameRef}
                    label={t("form.last_name")}
                    name="last_name"
                    type="text"
                    inputClassName="max-md:text-sm max-sm:text-xs bg-warm-cream/30 border-warm-tan/30 focus-visible:ring-primary-main/20 focus-visible:border-primary-main rounded-xl transition-all"
                    labelClassname="text-sm font-semibold text-secondary-dark/80"
                    defaultValue={state.last_name}
                  />
                </div>

                <InputText
                  ref={emailRef}
                  label={t("form.email")}
                  name="email"
                  type="email"
                  inputClassName="max-md:text-sm max-sm:text-xs bg-warm-cream/30 border-warm-tan/30 focus-visible:ring-primary-main/20 focus-visible:border-primary-main rounded-xl transition-all"
                  labelClassname="text-sm font-semibold text-secondary-dark/80"
                  defaultValue={state.email}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="block text-secondary-dark/80 text-sm font-semibold"
                >
                  {t("form.message.label")}
                </label>
                <Textarea
                  ref={messageRef}
                  id="message"
                  rows={6}
                  className="bg-warm-cream/30 border-warm-tan/30 focus-visible:ring-primary-main/20 focus-visible:border-primary-main max-md:text-sm max-xsm:text-xs resize-none rounded-xl p-4 transition-all"
                  placeholder={t("form.message.placeholder")}
                  name="message"
                />
              </div>

              {error.length > 0 && <ZodErrorDisplay error={error} />}

              <Button
                size={"lg"}
                disabled={isPending}
                type="submit"
                className="w-full bg-primary-main hover:bg-primary-main-dark text-white rounded-xl py-6 font-semibold shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98]"
              >
                {isPending ? <Loading /> : t("form.submit")}
              </Button>
            </form>
          </div>

          {/* Right Column - Direct Contact & Social */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            {/* Contact Info Card */}
            <div className="bg-white p-8 rounded-3xl border border-warm-tan/20 shadow-sm flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-dark">
                  {t("contact_info")}
                </h2>
                <p className="text-sm text-secondary-dark/60 mt-2 leading-relaxed">
                  {t("contact_info_sub")}
                </p>
              </div>

              <div className="flex flex-col gap-5 mt-2">
                {/* Email Item */}
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary-muted border border-warm-tan/15 flex items-center justify-center shrink-0 group-hover:bg-primary-main group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.15)] transition-all duration-300">
                    <Mail className="w-5 h-5 text-primary-main group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary-dark/40">
                      {t("email_label")}
                    </span>
                    <a
                      href="mailto:barangaybagongsilangan123@gmail.com"
                      className="text-sm font-semibold text-secondary-dark hover:text-primary-main transition-colors mt-1 break-all"
                    >
                      barangaybagongsilangan123@gmail.com
                    </a>
                    <a
                      href="mailto:barangaybagongsilangan123@gmail.com"
                      className="group/btn inline-flex items-center gap-1 text-xs font-bold text-primary-main hover:text-primary-main-dark transition-colors mt-2"
                    >
                      <span>Send an email</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary-muted border border-warm-tan/15 flex items-center justify-center shrink-0 group-hover:bg-primary-main group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.15)] transition-all duration-300">
                    <Phone className="w-5 h-5 text-primary-main group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary-dark/40">
                      {t("phone_label")}
                    </span>
                    <a
                      href="tel:0285645647"
                      className="text-sm font-semibold text-secondary-dark hover:text-primary-main transition-colors mt-1"
                    >
                      (02) 856-456-47
                    </a>
                    <a
                      href="tel:0285645647"
                      className="group/btn inline-flex items-center gap-1 text-xs font-bold text-primary-main hover:text-primary-main-dark transition-colors mt-2"
                    >
                      <span>Call office</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary-muted border border-warm-tan/15 flex items-center justify-center shrink-0 group-hover:bg-primary-main group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(45,90,39,0.15)] transition-all duration-300">
                    <MapPin className="w-5 h-5 text-primary-main group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary-dark/40">
                      {t("visit_label")}
                    </span>
                    <a
                      href="https://maps.app.goo.gl/eaaKtQ6t4ezupMWk8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-secondary-dark hover:text-primary-main transition-colors mt-1 leading-relaxed"
                    >
                      A. Bonifacio St. Bagong Silangan, QC
                    </a>
                    <a
                      href="https://maps.app.goo.gl/eaaKtQ6t4ezupMWk8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1 text-xs font-bold text-primary-main hover:text-primary-main-dark transition-colors mt-2"
                    >
                      <span>Get directions</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Community Card - Balanced Sage-Green Theme */}
            <div className="relative bg-gradient-to-br from-[#E8F4E5] to-[#D5ECD0]/70 p-8 rounded-3xl border border-[#2D5A27]/15 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 flex flex-col gap-4 overflow-hidden">
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27]/30 via-[#2D5A27] to-[#2D5A27]/50"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27] flex items-center justify-center shadow-sm">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-secondary-dark">{t("social_label")}</h3>
              </div>
              
              <p className="text-[#2D5A27]/85 font-medium text-sm leading-relaxed">
                Join the Barangay Bagong Silangan community page on Facebook to stay informed about recycling drives, points-for-rice updates, and local eco events!
              </p>
              
              <a
                href="https://www.facebook.com/brgybagongsilanganqc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#1E3B1A] text-white transition-colors text-sm font-semibold shadow-sm cursor-pointer"
              >
                {t("social_action")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

