import InputText from "@/components/general/InputText";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ContactUsImage from "@/assets/contact-us image.png";
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
      messageRef.current!.value = "";
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
        <div className="text-center mb-16 max-md:mb-12">
          <span className="text-primary-main text-sm font-semibold uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="mt-3 text-4xl max-lg:text-3xl max-md:text-2xl font-bold text-secondary-dark">
            {t("header")}
          </h1>
          <p className="mt-4 text-secondary-dark/60 max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="flex items-center justify-center gap-16 max-lg:gap-10">
          <form
            className="flex flex-col gap-6 max-md:text-sm max-lg:w-full bg-white p-10 max-md:p-8 rounded-2xl border border-warm-tan/30 max-w-lg w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 max-sm:flex-col">
                <InputText
                  ref={firstNameRef}
                  label={t("form.first_name")}
                  name="first_name"
                  type="text"
                  inputClassName="max-md:text-sm max-sm:text-xs"
                  labelClassname="text-sm font-medium text-secondary-dark"
                  defaultValue={state.first_name}
                />
                <InputText
                  ref={lastNameRef}
                  label={t("form.last_name")}
                  name="last_name"
                  inputClassName="max-md:text-sm max-sm:text-xs"
                  type="text"
                  labelClassname="text-sm font-medium text-secondary-dark"
                />
              </div>

              <InputText
                ref={emailRef}
                label={t("form.email")}
                inputClassName="max-md:text-sm max-sm:text-xs"
                name="email"
                type="email"
                labelClassname="text-sm font-medium text-secondary-dark"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="block text-secondary-dark text-sm font-medium">
                {t("form.message.label")}
              </label>
              <Textarea
                ref={messageRef}
                rows={6}
                className="bg-warm-beige/50 border-warm-tan/30 max-md:text-sm max-xsm:text-xs resize-none"
                placeholder={t("form.message.placeholder")}
                name="message"
              />
            </div>
            <ZodErrorDisplay error={error} />
            <Button 
              size={"lg"} 
              disabled={isPending} 
              type="submit"
              className="w-full"
            >
              {isPending ? <Loading /> : t("form.submit")}
            </Button>
          </form>
          
          <div className="w-[400px] h-[400px] max-lg:hidden flex-shrink-0">
            <img
              loading="lazy"
              src={ContactUsImage}
              aria-hidden
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
