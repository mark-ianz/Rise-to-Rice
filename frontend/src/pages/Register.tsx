import AuthPageLayout from "@/components/page-components/auth/AuthPageLayout";
import AuthShell from "@/components/page-components/auth/AuthShell";
import LeftSide from "@/components/page-components/register/left-side/Form";
import RightSide from "@/components/page-components/register/right-side/RightSide";
import { Helmet } from "react-helmet";

export default function Register() {
  return (
    <AuthPageLayout id="register">
      <Helmet>
        <title>Register | Rise to Rice</title>
        <meta
          name="description"
          content="Create an account on Rise to Rice to start redeeming rewards and accessing exclusive features!"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://risetorice.com/register" />

        <meta property="og:title" content="Register - Rise to Rice" />
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

      <AuthShell hero={<RightSide />}>
        <LeftSide />
      </AuthShell>
    </AuthPageLayout>
  );
}
