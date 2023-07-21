import { useLocation, useNavigate } from 'react-router';

interface Props {
  path: string;
  SelectedIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
}

const NavigationBarItem = ({ path, SelectedIcon, Icon, text }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSelected = path === pathname;

  return (
    <div
      className={`mt-[3.125rem] flex w-[10.0625rem] cursor-pointer flex-col items-center`}
      onClick={() => {
        navigate(path);
      }}
    >
      {isSelected ? (
        <SelectedIcon className="h-[2.8125rem] w-[2.8125rem]" />
      ) : (
        <Icon className="h-[2.8125rem] w-[2.8125rem]" />
      )}
      {<div className={`${isSelected && 'text-main-1'}`}>{text}</div>}
      {isSelected && (
        <div className="absolute right-0 h-[4.5rem] w-[.4375rem] rounded-3xl bg-main-1" />
      )}
    </div>
  );
};

export default NavigationBarItem;
