import HeaderText from "@/components/general/HeaderText";
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
import { Helmet } from "react-helmet";

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
      className="px-20 py-16 justify-center gap-16 max-lg:px-10 max-sm:px-6 max-md:py-12 max-lg:gap-10"
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

      <form
        className="flex flex-col gap-6 max-md:text-sm max-lg:w-full bg-white p-8 max-md:p-6 rounded-xl shadow-sm max-w-lg w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <HeaderText className="text-3xl max-lg:text-2xl max-md:text-xl">{t("header")}</HeaderText>
          <p className="italic text-tertiary text-base max-md:text-sm">{t("description")}</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 max-sm:flex-col">
            <InputText
              ref={firstNameRef}
              label={t("form.first_name")}
              name="first_name"
              type="text"
              inputClassName="max-md:text-sm max-sm:text-xs focus:ring-2 focus:ring-primary-main/20 transition-all duration-200"
              labelClassname="text-sm font-medium"
              defaultValue={state.first_name}
            />
            <InputText
              ref={lastNameRef}
              label={t("form.last_name")}
              name="last_name"
              inputClassName="max-md:text-sm max-sm:text-xs focus:ring-2 focus:ring-primary-main/20 transition-all duration-200"
              type="text"
              labelClassname="text-sm font-medium"
            />
          </div>

          <InputText
            ref={emailRef}
            label={t("form.email")}
            inputClassName="max-md:text-sm max-sm:text-xs focus:ring-2 focus:ring-primary-main/20 transition-all duration-200"
            name="email"
            type="email"
            labelClassname="text-sm font-medium"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="block text-primary text-sm font-medium">
            {t("form.message.label")}
          </label>
          <Textarea
            ref={messageRef}
            rows={8}
            className="bg-background max-md:text-sm max-xsm:text-xs focus:ring-2 focus:ring-primary-main/20 transition-all duration-200 resize-none"
            placeholder={t("form.message.placeholder")}
            name="message"
          />
        </div>
        <ZodErrorDisplay error={error} />
        <div className="flex justify-end pt-2">
          <Button 
            size={"default"} 
            disabled={isPending} 
            type="submit"
            className="px-8 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? <Loading /> : t("form.submit")}
          </Button>
        </div>
      </form>
      <div className="w-[450px] h-[450px] max-lg:w-[350px] max-lg:h-[350px] max-md:hidden flex-shrink-0">
        <img
          loading="lazy"
          src={ContactUsImage}
          aria-hidden
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </SectionWrapper>
  );
}
