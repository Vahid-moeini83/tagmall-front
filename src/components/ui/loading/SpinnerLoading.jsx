function SpinnerLoading({ className = "", size = 16 }) {
  return (
    <div
      className={`border-2 border-t-transparent rounded-full animate-spin ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

export default SpinnerLoading;
