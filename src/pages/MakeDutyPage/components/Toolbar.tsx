function Toolbar() {
  return (
    <div className="w-[calc(100% - 32px)] flex h-[60px] gap-4 border-b-[1px] border-[#e0e0e0] bg-[#FFF] px-4 ">
      <div className="flex h-[60px] items-center justify-center text-xl font-bold text-[#333]">
        <div>D</div>
        <div>1/3</div>
      </div>
      <div className="flex h-[60px] items-center justify-center text-xl font-bold text-[#333]">
        <div>E</div>
        <div>2/3</div>
      </div>
      <div className="flex h-[60px] items-center justify-center text-xl font-bold text-[#333]">
        <div>N</div>
        <div>3/3</div>
      </div>
      <div className="flex flex-1 items-center">
        <p>도움말</p>
      </div>
      <div className="flex gap-4">
        <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#fcd4fc] text-sm font-bold text-[#333]">
          Auto Fill
        </button>
        <button className="my-[10px] h-[40px] w-[100px] cursor-pointer rounded  bg-[#c6dbf0] text-sm font-bold text-[#333]">
          완료
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
