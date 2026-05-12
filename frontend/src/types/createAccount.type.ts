export type CreateAccountState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string | null;
  address: string;
  contact_number: string;
  birthdate: Date | string | null | undefined;
  email: string;
  gender: Gender;
  password: string;
  confirm_password: string;
  error: string[] | null;
  success: string;
  loading: boolean;
};

export type Gender = "male" | "female" | "prefer not to say"