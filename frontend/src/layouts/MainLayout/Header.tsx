import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LuMoonStar, LuSunMedium } from "react-icons/lu";
import logo from "@/assets/logo2.svg";
import avatar from "@/assets/avatar.svg";
import { useTheme } from "@/shared/theme/themeContext";

const navItems = [
  { label: "Home", path: "/DoctorDashboardPage" },
  { label: "Patients", path: "/patients" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const name = "Amr Khaled";

  return (
    <motion.header className="sticky py-6  w-full container mx-auto top-0 z-50">
      <motion.div
        className=" mx-auto flex  items-center w-full justify-between gap-4 border  py-3 text-sm backdrop-blur-xl animate duration-300 sm:px-6"
        animate={{
          // backgroundColor: scrolled
          //   ? "var(--header-shell-scrolled)"
          //   : "var(--header-shell)",
          borderColor: scrolled
            ? "var(--border-subtle)"
            : "rgba(255,255,255,0)",
          boxShadow: scrolled ? "var(--shadow-md)" : "0 0 0 rgba(0,0,0,0)",
          borderRadius: scrolled ? "20px" : "0px",
        }}
        // transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <img src={logo} alt="NeuroGuard" className="w-13 h-auto" />

        {/* Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-[var(--navbar-border)] bg-[var(--header-nav-shell)] px-2 py-2 shadow-sm">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "rounded-full px-5 py-2 font-medium transition-colors duration-200",
                      isActive
                        ? "bg-[var(--header-nav-active)] text-brand-primary"
                        : "text-[var(--text-secondary)] hover:text-brand-primary",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex size-10 items-center justify-center rounded-full border border-(--border-subtle) bg-(--header-nav-shell) text-(--header-icon) shadow-sm transition-colors duration-200 hover:text-brand-primary"
          >
            {isDark ? (
              <LuSunMedium className="text-lg" />
            ) : (
              <LuMoonStar className="text-lg" />
            )}
          </button>
          <p className="app-border-strong app-text-primary border-r pr-4 font-bold">
            {name}
          </p>
          <img
            src={avatar}
            alt="Avatar"
            className="size-8 rounded-full ring-2 ring-brand-primary-soft"
          />
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
