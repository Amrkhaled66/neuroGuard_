import StaticCard from "../components/StaticCard";
import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { MdOutlineGroups2 } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { LuBrain } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";

import StaticCardSkeleton from "../ui/skeletons/StaticCardSkeleton";
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export function StaticCards() {
  const isLoading = false;
  return (
    <motion.section
      className="mt-8 grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <StaticCardSkeleton key={index} />
          ))
        : fakeItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants as Variants}>
              <StaticCard
                label={item.title}
                value={item.state}
                icon={item.icon}
                isDanger={item.isDanger}
              />
            </motion.div>
          ))}
    </motion.section>
  );
}

export type { StaticCardItem };

type StaticCardItem = {
  id: string;
  title: string;
  state: number;
  icon: ReactNode;
  isDanger?: boolean;
};

const fakeItems: StaticCardItem[] = [
  {
    id: "1",
    title: "Total Patients",
    state: 120,
    icon: <MdOutlineGroups2 />,
    isDanger: false,
  },
  {
    id: "2",
    title: "Active Sessions",
    state: 120,
    icon: <SiGoogleanalytics />,
    isDanger: false,
  },
  {
    id: "3",
    title: "EEG FILES",
    state: 120,
    icon: <LuBrain />,
    isDanger: true,
  },
  {
    id: "4",
    title: "Critical Alerts",
    state: 120,
    icon: <GoAlertFill />,
    isDanger: true,
  },
];
