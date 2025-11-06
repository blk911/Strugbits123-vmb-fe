const LoadingIndicator = ({ size = "lg" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };


  return (
    <div
      className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 border-[#FF92A5]`}
    ></div>
  );
};

export default LoadingIndicator;
