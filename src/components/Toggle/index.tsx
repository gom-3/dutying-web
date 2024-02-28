interface ToggleProps {
  isOn: boolean;
  setIsOn: (isOn: boolean) => void;
}

const Toggle = ({ isOn, setIsOn }: ToggleProps) => {
  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div
      data-testid="toggle"
      onClick={handleToggle}
      className={`relative h-[1rem] w-[1.875rem] cursor-pointer rounded-[1rem] transition-[0.8s] ${
        isOn ? 'bg-main-1' : 'bg-sub-4'
      }`}
    >
      <div
        className={`absolute top-0 h-[1rem] w-[1rem] rounded-[1rem] border-[.0625rem] bg-white transition-[0.8s] ${
          isOn ? 'left-[100%] translate-x-[-100%] border-main-1' : 'left-0 border-sub-4'
        }`}
      />
    </div>
  );
};

export default Toggle;
