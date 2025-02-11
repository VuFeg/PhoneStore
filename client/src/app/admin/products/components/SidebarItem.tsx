import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  expanded: boolean;
}

const SidebarItem = ({ icon, text, active, expanded }: SidebarItemProps) => (
  <div
    className={`flex items-center gap-4 p-2 mb-2 rounded-lg cursor-pointer ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-accent hover:bg-secondary"
    }`}
  >
    {icon}
    {expanded && <span>{text}</span>}
  </div>
);

export default SidebarItem;
