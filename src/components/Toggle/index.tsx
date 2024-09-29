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
      className={`relative h-4 w-[1.875rem] cursor-pointer rounded-2xl transition-[0.8s] ${isOn ? 'bg-main-1' : 'bg-sub-4'}`}
    >
      <div
        className={`absolute top-0 size-4 rounded-2xl border-[.0625rem] bg-white transition-[0.8s] ${
          isOn ? 'left-full -translate-x-full border-main-1' : 'left-0 border-sub-4'
        }`}
      />
    </div>
  );
};

export default Toggle;
