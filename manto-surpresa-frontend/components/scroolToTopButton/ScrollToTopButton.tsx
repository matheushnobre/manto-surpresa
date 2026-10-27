"use client";

import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  return (
    <Button
      className="bg-[#5CFF5C] px-8 py-6 text-md"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Quero ser Surpreendido!
    </Button>
  );
}