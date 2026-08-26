"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "a209b547-608c-44e7-9178-4976a73c7135",
        "11bce5cb-bfda-4c8f-afcc-4a512e2d7361",
        "7ddf3794-111c-45ba-bd4c-36935d8ed81b",
      ],
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      Upgrade
    </Button>
  );
}
