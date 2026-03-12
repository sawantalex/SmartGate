export default function Loader({ size = "md" }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-14 w-14 border-4",
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-[#3b82f6] border-t-transparent`}
      role="status"
      aria-label="Loading"
    />
  )
}
