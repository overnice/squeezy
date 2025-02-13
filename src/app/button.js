export default function Button({ className, text, compact = false, themeColors = true, onClick }) {
  const widthClasses = compact ? "w-7 h-7" : "w-10 h-10";
  const textClasses = compact ? "text-lg" : "text-xl";
  const transformClasses = compact
    ? "group-hover:-translate-x-2"
    : "group-hover:-translate-x-4";
  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <div
        className={`group cursor-pointer select-none flex items-center gap-2.5 ${textClasses} mt-2xs ${themeColors ? 'text-[var(--foreground)] hocus:text-[var(--foreground)]' : 'text-white hocus:text-white'}`}
      >
        <div
          className={`transition-all rounded-full group-hover:w-full absolute top-0 left-0 ${widthClasses} ${themeColors ? 'bg-[var(--foreground)]' : 'bg-white'}`}
        ></div>
        <div
          className={`relative ${widthClasses} rounded-full flex flex-wrap transition-transform group-hover:[transform:rotateX(180deg)] content-center`}
        >
          <svg
            width="12"
            height="18"
            viewBox="0 0 12 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pl-[2px] mx-auto ${themeColors ? 'text-[var(--background)]' : 'text-black'} stroke-current h-[14px] ${
              compact ? "stroke-[2.9px]" : "stroke-[3px]"
            }`}
          >
            <path d="M2 2L9 9L2 16" />
          </svg>
        </div>
        <div
          className={`transition-all ${themeColors ? 'group-hover:!text-[var(--background)]' : 'group-hover:!text-black'} w-fit ${transformClasses}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
