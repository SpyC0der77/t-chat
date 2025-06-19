import BgGradient from "@/components/bg-gradient";
import { DotsLoader } from "@/components/ui/dot-loading";
import { useCustomAuth } from "./chat/contexts/auth";
import { Navigate } from "react-router";

export default function Setting() {
  const { isLoading, isAuthenticated } = useCustomAuth();
  if (isLoading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <BgGradient />
        <DotsLoader size="xl" className="space-x-2" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <Navigate to="/auth" replace />
    )
  }
  return <Navigate to="/" />

}
