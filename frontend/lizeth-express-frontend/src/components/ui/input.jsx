export function Input({ className = '', ...props }) {
    return (
      <input
        className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
    );
  }
  