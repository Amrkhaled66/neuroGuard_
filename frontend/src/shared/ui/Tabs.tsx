import React from "react";
import { Link } from "react-router-dom";

type TabItem = {
  key: string;
  label: string;
  to: string;
  icon?: React.ElementType;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
};

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <div className="app-surface-soft w-full rounded-3xl px-3 py-2 sm:px-4">
      <div className="">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;

            return (
              <Link
                key={tab.key}
                to={tab.to}
                onClick={() => onChange(tab.key)}
                className={[
                  "relative flex shrink-0 items-center gap-2 rounded-t-2xl border-b-2 px-2 py-4 text-sm font-semibold transition-colors sm:px-3 sm:py-5 sm:text-base",
                  isActive
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent app-text-secondary hover:text-brand-primary",
                ].join(" ")}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
