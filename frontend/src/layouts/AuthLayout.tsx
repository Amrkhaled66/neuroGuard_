import React from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import logo from "@/assets/logo2.svg";
interface AuthLayoutProps {
  children: React.ReactNode;
}

const leftPanelVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex size-full items-center gap-x-4 rounded-xl lg:p-8">
        {/* LEFT IMAGE PANEL */}
        <motion.div
          className="relative hidden h-full w-[50%] items-center justify-center lg:flex"
          variants={leftPanelVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <div
            style={{
              backgroundImage: 'url("./Auth.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative h-full w-full overflow-hidden rounded-xl shadow-lg"
          >
            {/* subtle overlay animation */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        {/* RIGHT FORM PANEL */}
        <motion.div
          className="app-surface-soft flex h-full w-full flex-col items-center justify-center space-y-3 rounded-xl px-5 py-3 drop-shadow-md lg:w-[50%] lg:px-8"
          variants={rightPanelVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <div className="">
            <Link to="/">
              <img src={logo} alt="Neuro Guard" className="h-24" />
            </Link>
          </div>

          <div className="w-full">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
