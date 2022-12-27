const Modal = ({ setModalOn }) => {
  const handleOKClick = () => {
    // setChoice(true);
    setModalOn(false);
  };
  const handleCancelClick = () => {
    // setChoice(false);
    setModalOn(false);
  };

  return (
    <div className="bg-black bg-opacity-50 fixed inset-0 z-50   ">
      <div className="flex h-screen justify-center items-center ">
        <div className="flex flex-col   bg-white py-12 px-16 border-1 border-blue-500 rounded-xl ">
          <div className="flex  text-[26px]  text-black   mb-8 font-semibold">
            No Face Detected
          </div>
          <div className="flex flex-row basis-full justify-center">
            <button
              onClick={handleOKClick}
              className=" rounded px-4 py-2 text-white  bg-blue-500 "
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
