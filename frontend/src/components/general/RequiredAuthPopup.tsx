import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import GetStartedButton from "../page-components/landing page/GetStartedButton";

type Props = {
  children: ReactNode;
};

export default function RequiredAuthPopup({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the community to unlock this feature!</DialogTitle>
          <DialogDescription>
            This feature is only available to logged-in users.
            <br />
            Please log in or register to access this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full">
          <GetStartedButton className="p-2 w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
