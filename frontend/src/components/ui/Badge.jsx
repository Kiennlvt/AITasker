export default function Badge({ children, className = "" }) {
    return (
        <span
            className={`rounded-full bg-orange-100 px-3 py-1 text-[9px] font-black text-orange-500 ${className}`}
        >
            {children}
        </span>
    );
}