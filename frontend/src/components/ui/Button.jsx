export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  leftIcon ,
  rightIcon,
}) {
  const base =
    "px-10 py-4 rounded-[24px] font-bold transition-all duration-300 active:scale-95";

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:-translate-y-1",

    secondary:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:-translate-y-1 hover:text-white",

    third:
      "flex items-center gap-1.5 border border-gray-200 text-gray-600 bg-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {/* Nếu có leftIcon thì render ra, không có thì bỏ qua == if else */}
      {leftIcon && (
        <span className="flex items-center shrink-0">{leftIcon}</span>
      )}

      {/* Nội dung chữ của nút */}
      {children}

      {/* Nếu có rightIcon thì render ra, không có thì bỏ qua */}
      {rightIcon && (
        <span className="flex items-center shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
