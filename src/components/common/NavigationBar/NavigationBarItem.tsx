import { useLocation, useNavigate } from 'react-router';

interface Props {
  path: string;
  mt: number;
  SelectedIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
}

const NavigationBarItem = ({ path, mt, SelectedIcon, Icon, text }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSelected = path === pathname;

  return (
    <div
      className={`mt-[${mt}px] flex w-full cursor-pointer flex-col items-center`}
      onClick={() => navigate(path)}
    >
      {isSelected ? <SelectedIcon /> : <Icon />}
      {<div className={`${isSelected && 'text-main-1'}`}>{text}</div>}
      {isSelected && <div className="absolute right-0 h-[72px] w-[7px] rounded-3xl bg-main-1" />}
    </div>
  );
};

export default NavigationBarItem;
