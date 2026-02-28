type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "danger" | "ghost";
  disabled?: boolean;
  width?: "sm" | "xs" | "xl" | "full" | "md" | "lg" | "auto" | "2xl" | "2xs" | "3xs";
  padding?: string;
  rounded?: "full" | "lg" | "sm"
};

export default function Button({
  children,
  loading = false,
  loadingText = "Loading...",
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  width = "full",
  padding = "2",
  rounded = "lg"
}: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger:  "bg-red-500 hover:bg-red-600 text-white",
    ghost:   "bg-gray-100 hover:bg-gray-200 text-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-${width} font-medium py-2 px-${padding} rounded-${rounded} text-sm transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]}`}
    >
      {loading ? loadingText : children}
    </button>
  );
}
