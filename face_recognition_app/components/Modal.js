const Modal = ({ setModalOn, onClose, modalType, modalError = "" }) => {
  const handleOKClick = () => {
    // setChoice(true);

    setModalOn(false);
    onClose();
  };
  const handleCancelClick = () => {
    // setChoice(false);
    setModalOn(false);
  };

  return (
    <div className="bg-black bg-opacity-50 fixed inset-0 z-50   ">
      <div className="flex h-screen justify-center items-center ">
        {modalType == "Loading" ? (
          <div className="flex flex-col   bg-white py-12 px-16 border-1 border-blue-500 rounded-xl ">
            <div className="flex  text-[26px]  text-black   mb-8 font-semibold">
              Loading
            </div>
            <div className="flex flex-row basis-full justify-center"></div>
          </div>
        ) : modalType == "No Face" ? (
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
        ) : modalType == "Registered" ? (
          <div className="flex flex-col   bg-white py-12 px-16 border-1 border-blue-500 rounded-xl ">
            <div className="flex  text-[26px]  text-black   mb-8 font-semibold">
              Staff Registered
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
        ) : (
          <div className="flex flex-col   bg-white py-12 px-16 border-1 border-blue-500 rounded-xl ">
            <div className="flex  text-[26px]  text-black   mb-8 font-semibold">
              Error : {modalError}
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
        )}
      </div>
    </div>
  );
};

export default Modal;
