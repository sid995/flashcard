"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  FileUp,
  LogOut,
  BookIcon,
  ArrowRightToLine,
  ArrowLeftToLine,
  Brain,
} from "lucide-react";
import { useParams } from "next/navigation";

export const Sidebar = () => {
  const { username } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      className={cn(
        "flex flex-col h-screen bg-background border-r-gray-200 border-r transition-all duration-300 ease-in-out",
        {
          "w-[240px]": isExpanded,
          "w-[60px]": !isExpanded,
        }
      )}
    >
      <div
        className={cn("flex", {
          "justify-center": isExpanded,
          "justify-start": !isExpanded,
        })}
      >
        <div
          onClick={toggleSidebar}
          className={cn(
            "hover:bg-muted cursor-pointer mt-4 flex items-center",
            {
              "rounded-full py-2 px-8": isExpanded,
              "p-4 w-full": !isExpanded,
            }
          )}
        >
          {isExpanded ? (
            <ArrowLeftToLine size={20} />
          ) : (
            <ArrowRightToLine size={20} />
          )}
          {isExpanded && (
            <span className="text-lg font-bold pl-2">Collapse</span>
          )}
        </div>
      </div>
      <div className="flex items-center p-4">
        <BookIcon className="size-6" />
        <h3 className={cn("text-xl font-bold pl-2", { hidden: !isExpanded })}>
          FlashcardAI
        </h3>
      </div>

      <div className="flex flex-col flex-1 mt-8">
        <NavItem
          icon={<Brain size={24} />}
          text="Generate"
          isExpanded={isExpanded}
          href={`/${username}`}
        />
        <NavItem
          icon={<FileUp size={24} />}
          text="Upload a PDF"
          isExpanded={isExpanded}
        />
      </div>

      <div className="p-4">
        <NavItem
          icon={<LogOut size={24} />}
          text="Sign Out"
          isExpanded={isExpanded}
        />
      </div>
    </nav>
  );
};

const NavItem = ({
  icon,
  text,
  isExpanded,
  href = "#",
}: {
  icon: any;
  text: string;
  isExpanded: boolean;
  href?: string;
}) => {
  return (
    <a
      href={href}
      className="flex items-center p-4 text-gray-700 hover:bg-muted transition-colors duration-200 whitespace-nowrap overflow-hidden"
    >
      <span className="mr-4">{icon}</span>
      {isExpanded && <span>{text}</span>}
    </a>
  );
};

export default Sidebar;
