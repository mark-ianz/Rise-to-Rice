import Form_PersonalInformation from "./personal-information/Form_PersonalInformation";
import useCreateAccountContext from "@/hooks/useCreateAccountContext";
import { FormEvent, useEffect, useState } from "react";
import Field_SecondSection from "./credentials/Form_Credentials";
import { useNavigate } from "react-router-dom";
import { RegisterSections } from "@/types/register";
import EmailVerification from "./email-verification/EmailVerification";
import {
  UserCreate_First_Part,
  UserCreate_Second_Part,
} from "@/schema/CreateAccountSchema";
import { handleError } from "@/helper/errorHandler";
import LoadingComponent from "@/components/general/LoadingComponent";
import useUserContext from "@/hooks/useUserContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function LeftSide() {
  // Procedure:
  // 1. User fills out the personal information form and clicks "Continue"
  // 2. Local validation is performed on the personal information form
  // 3. If validation passes, the user is taken to the credentials form
  // 4. User fills out the credentials form and clicks "Continue"
  // 5. Local validation is performed on the credentials form
  // 6. If validation passes, the user is taken to the email verification form
  // 7. The code will be sent to the user's email address automatically
  // 8. User enters the code and clicks "Continue"
  // 9. If the code is incorrect, an error message will be displayed
  // 10. If the code is correct, the user will be registered and logged in
  // 11. The user will be redirected to the home page

  const { state, dispatch } = useCreateAccountContext();
  const { refetchAuth } = useUserContext();
  const [section, setSection] = useState<RegisterSections>(
    "personal-information"
  );
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      parsedData: UserCreate_First_Part & UserCreate_Second_Part
    ) => {
      const response = await axios.post("/api/user/create", parsedData);

      return response.data;
    },
    onError: (error) => {
      handleError(error, dispatch);
    },
    onSuccess: (data) => {
      dispatch({ type: "LOGIN", payload: data });
      refetchAuth();
      navigate("/");
    },
  });

  
  useEffect(() => {
    if (section === "success") {
      mutate(state as UserCreate_First_Part & UserCreate_Second_Part);
    }
  }, [section, mutate, state]);

  useEffect(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, [section, dispatch]);

  return (
    <form
      autoComplete="off"
      onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="rounded-l-xl w-full max-lg:rounded-none bg-secondary-light flex p-12 px-20 flex-col justify-center gap-4 max-xl:px-10 max-lg:px-6 max-md:px-4"
    >
      {isPending && (
        <span className="items-center flex justify-center">
          <LoadingComponent className="w-12 h-12" />
        </span>
      )}
      {section === "personal-information" && (
        <Form_PersonalInformation section={section} setSection={setSection} />
      )}
      {section === "credentials" && (
        <Field_SecondSection section={section} setSection={setSection} />
      )}
      {section === "email-verification" && (
        <EmailVerification section={section} setSection={setSection} />
      )}
    </form>
  );
}
