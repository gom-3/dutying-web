import 'index.css';

interface Props {
  date: string;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const WeekController = ({ date, onClickPrev, onClickNext }: Props) => {
  return (
    <div>
      <div>{date}</div>
      <div onClick={onClickPrev}>-</div>
      <div onClick={onClickNext}>+</div>
    </div>
  );
};

export default WeekController;
