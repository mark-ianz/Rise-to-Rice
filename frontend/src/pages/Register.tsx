import GoBackButton from "@/components/general/GoBackButton";
import LeftSide from "@/components/page-components/register/left-side/Form";
import RightSide from "@/components/page-components/register/right-side/RightSide";
import SectionWrapper from "@/components/general/SectionWrapper";
import { Helmet } from "react-helmet";

export default function Register() {
  return (
    <SectionWrapper
      className="justify-center px-20 py-10 max-md:px-10 max-sm:px-6"
      id="register"
    >
      <Helmet>
        <title>Register | Rise to Rice</title>
        <meta
          name="description"
          content="Create an account on Rise to Rice to start redeeming rewards and accessing exclusive features!"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/register" />

        <meta property="og:title" content="Register — Rise to Rice" />
        <meta
          property="og:description"
          content="Join our initiative today by registering. Help reduce waste and earn rewards through recycling!"
        />
        <meta property="og:url" content="https://risetorice.com/register" />
        <meta
          property="og:image"
          content="https://risetorice.com/frontend/og-image.png"
        />
      </Helmet>
      <div className="w-full h-full flex rounded-xl max-w-screen-lg shadow-lg bg-red-50 relative max-lg:flex-col">
        <GoBackButton className="max-lg:top-2 max-lg:left-2" />
        <LeftSide />
        <RightSide />
      </div>
    </SectionWrapper>
  );
}
