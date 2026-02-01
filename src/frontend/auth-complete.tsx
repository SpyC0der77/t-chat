import BgGradient from "@/components/bg-gradient";
import { DotsLoader } from "@/components/ui/dot-loading";
import { Navigate } from "react-router";
import { useConvexAuth } from "@/lib/mock-hooks";

export default function Setting() {
  const { isAuthenticated, isLoading } = useConvexAuth();
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
