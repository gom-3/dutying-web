import useEditWard from '@hooks/useEditWard';

function WardInfo() {
  const {
    state: { ward },
  } = useEditWard();
  return <div></div>;
}

export default WardInfo;
