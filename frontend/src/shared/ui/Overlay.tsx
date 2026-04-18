
const Overlay = ({
  bgColor = "#d9d9d94d",
  onClick,
  show,
}: {
  bgColor?: string;
  onClick?: () => void;
  show?: boolean;
}) => {
  return (
    <div
      onClick={() => {
      
        onClick && onClick();
      }}
      style={{
        backgroundColor: bgColor,
      }}
      className={`fixed top-0 right-0 bottom-0 left-0 z-[70] opacity-0 backdrop-blur-xs transition-all duration-300 ease-in-out ${show ? "opacity-100" : "pointer-events-none"}`}
      data-testid="overlay"
    ></div>
  );
};

export default Overlay;