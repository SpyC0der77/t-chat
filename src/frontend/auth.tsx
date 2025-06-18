import BackButton from "@/components/back-button";
import BgGradient from "@/components/bg-gradient";
import SignIn from "@/services/auth/components/sign-in";
import Image from "next/image";
import { Link } from "react-router";

export default function Auth() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <BgGradient />
      <BackButton />
      <h1 className="mb-5 h-5 text-xl font-bold text-foreground">
        Welcome to
        <Image
          alt="T4 Chat logo"
          loading="lazy"
          width="96"
          height="20"
          decoding="async"
          data-nimg="1"
          className="-mt-1 ml-1.5 inline-block"
          src="/images/t4logo.svg"
          style={{ color: "transparent" }}
        />
      </h1>
      <div className="mb-8 text-center text-muted-foreground">
        <p>Sign in below (we&apos;ll increase your inner limits if you do 😉)</p>
      </div>
      <SignIn />
      <div className="mt-6 text-center text-sm text-muted-foreground/60">
        <p>By continuing, you agree to our <Link to="/terms-of-service" className="text-muted-foreground hover:text-white">Terms of Service</Link> and <Link to="/privacy-policy" className="text-muted-foreground hover:text-white">Privacy Policy</Link></p>
      </div>
    </div>
  );
}
