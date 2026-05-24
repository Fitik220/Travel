"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function DropdownNav() {
  const { text } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      href: "/explore",
      label: text.common.globe,
      borderColor: "border-[#FF6B6B]",
      hoverColor: "hover:text-[#20C997]",
    },
    {
      href: "/assistant",
      label: text.common.aiAssistant,
      borderColor: "border-[#20C997]",
      hoverColor: "hover:text-[#FFD93D]",
    },
    {
      href: "/tours",
      label: text.common.tourBuilder,
      borderColor: "border-[#A8E6CF]",
      hoverColor: "hover:text-[#FF6B6B]",
    },
    {
      href: "/compare",
      label: "Compare",
      borderColor: "border-[#FFD93D]",
      hoverColor: "hover:text-[#FF6B6B]",
    },
    {
      href: "/mood",
      label: "Mood",
      borderColor: "border-[#20C997]",
      hoverColor: "hover:text-[#FFD93D]",
    },
    {
      href: "/resorts",
      label: "Resorts",
      borderColor: "border-[#FF6B6B]",
      hoverColor: "hover:text-[#20C997]",
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border-2 border-[#FF6B6B] px-4 py-2 text-sm font-medium text-[#2D2D2D] transition hover:bg-[#FF6B6B]/10 bg-white/50"
      >
        Menu
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border-2 border-[#FF6B6B] bg-white/95 shadow-lg backdrop-blur z-50">
          <div className="p-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left rounded-lg px-4 py-2 text-sm text-[#2D2D2D] transition border-2 ${item.borderColor} bg-white/50 hover:bg-[#FF6B6B]/20 ${item.hoverColor}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
