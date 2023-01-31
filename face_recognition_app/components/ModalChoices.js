const Modal = ({ setModalOn, handleChoice, name = "name" }) => {
  const handleYesClick = () => {
    handleChoice(true);

    setModalOn(false);
  };
  const handleNoClick = () => {
    handleChoice(false);
    setModalOn(false);
  };

  return (
    <div className="bg-black bg-opacity-50 fixed inset-0 z-50   ">
      <div className="flex h-screen justify-center items-center ">
        <div className="flex flex-col   bg-white py-12 px-16 border-1 border-blue-500 rounded-xl ">
          <div className="flex  text-[26px]  text-black   mb-2 font-semibold">
            Are you sure?
          </div>
          <div className="flex  text-[18px]  text-black mb-8 font-regular">
            You want to delete {name}
          </div>
          <div className="flex flex-row basis-full justify-center gap-4 items-stretch">
            <button
              onClick={handleNoClick}
              className="grow rounded px-4 py-2 text-black-500 font-semibold border border-slate-200 hover:bg-slate-200"
            >
              No
            </button>
            <button
              onClick={handleYesClick}
              className="grow rounded px-4 py-2 text-white  bg-red-500 "
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
