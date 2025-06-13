import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBackClick = () => {
    const redirectTo = searchParams.get("rt");
    if (redirectTo) {
      navigate(`/chat/${redirectTo}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="absolute left-4 top-4">
      <Button
        onClick={handleBackClick}
        variant="ghost"
        className="hover:text-foreground px-4 rounded-md hover:bg-muted/40"
      >
        <Icon name="back" className="mr-2 h-4 w-4" />
        Back to Chat
      </Button>
    </div>
  );
}
