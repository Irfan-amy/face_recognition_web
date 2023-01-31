// import type { NextPage } from "next";
import Modal from "../components/Modal";
import ModalChoices from "../components/ModalChoices";
import React from "react";
// import video from "../statics/1.mp4";

const StaffList = () => {
  const [listStaff, setListStaff] = React.useState([]);
  const [modalChoices, setModalChoices] = React.useState(false);
  const [nameSelected, setNameSelected] = React.useState("");
  const [modalOn, setModalOn] = React.useState(false);
  const [modalType, setModalType] = React.useState(false);
  const [modalError, setModalError] = React.useState("");

  React.useEffect(() => {
    getStaffList().then((staffList) => {
      setListStaff(
        staffList.filter(function (staffName) {
          return !!staffName;
        })
      );
    });
  }, []);

  async function getStaffList() {
    var result = await fetch("/api/getStaffList", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (result.status == 200) {
      const { staffList } = await result.json();
      return staffList;
    }
  }

  async function handleChoice(choice) {
    if (choice == true) {
      setModalType("Loading");
      setModalOn(true);
      var result = await fetch("/api/deleteStaff", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: nameSelected,
        }),
      });
      if (result.status == 200) {
       refresh();
      } else {
        const { error } = await result.json();
        console.log(error);
        setModalOn(false);
        setModalError(error);
        setModalType("Error");
        setModalOn(true);
      }
    }
  }
  function refresh() {
    window.location.href = "/staffList";
  }
  function goHome() {
    window.location.href = "/";
  }
  function goAddStaff() {
    window.location.href = "/registerStaff";
  }
  function onClickDeleteBtn(name) {
    setNameSelected(name);
    setModalChoices(true);
  }

  return (
    <section className="flex gap-0 bg-black">
      <div className="items-stretch flex flex-col w-full ">
        <div className="flex flex-row self-end absolute bottom-8 w-full justify-center gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
            className="self-center bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ffffff"
              className="w-8 h-8"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              goAddStaff();
            }}
            className="self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ffffff"
              className="w-8 h-8"
            >
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
            </svg>
          </button>
        </div>
        <div className=" px-16 py-16 font-[Montserrat]  flex flex-col h-screen ">
          <div className=" grow bg-white rounded-lg px-16 py-12 overflow-y-auto">
            <div className="flex flex-col w-full">
              <div className="flex-none w-full">
                <h1 className="font-semibold text-3xl pb-4">Staff List</h1>
              </div>

              {listStaff.map((name) => (
                <div className="flex-none flex flex-row w-full my-2 px-6 py-2 border border-slate-300 rounded-lg items-center">
                  <div className="grow ">{name}</div>
                  <div className="flex-none">
                    <button
                      className=" hover:bg-slate-200 text-red-500 font-bold py-2 px-2 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        onClickDeleteBtn(name);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#ef4444"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {modalChoices && (
        <ModalChoices
          setModalOn={setModalChoices}
          name={nameSelected}
          handleChoice={handleChoice}
        />
      )}
      {modalOn && (
        <Modal
          setModalOn={setModalOn}
          onClose={() => {}}
          modalError={modalError}
          modalType={modalType}
        />
      )}
    </section>
  );
};

export default StaffList;
