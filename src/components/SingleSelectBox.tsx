import 'index.css';

interface Option {
  name: string;
  isSelected: boolean;
}

interface Props {
  options: Option[];
}

const SingleSelectBox = ({ options }: Props) => {
  return (
    <div>
      {options.map((option) => {
        return <div className="">{option.name}</div>;
      })}
    </div>
  );
};

export default SingleSelectBox;
