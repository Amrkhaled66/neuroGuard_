import { IoMdSearch } from "react-icons/io";

const PatientsTableSearch = () => {
  return (
    <div className="relative w-full lg:max-w-md">
      <IoMdSearch className="absolute inset-s-3 top-3 text-2xl" />
      <input
        // type="search"
        placeholder="Search patients by name, ID or clinical status..."
        className="app-surface ps-10 app-text-primary placeholder:app-text-secondary focus:border-brand-primary/40 h-12 w-full rounded-2xl border border-black/10 text-sm transition outline-none  dark:border-white/10"
      />
    </div>
  );
};

export default PatientsTableSearch;
