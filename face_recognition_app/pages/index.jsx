// import type { NextPage } from "next";
import Modal from "../components/Modal";
import ModalChoices from "../components/ModalChoices";
import React from "react";
// import video from "../statics/1.mp4";

const Home = () => {
  const [listStaff, setListStaff] = React.useState([]);
  const [modalChoices, setModalChoices] = React.useState(false);
  const [nameSelected, setNameSelected] = React.useState("");
  const [modalOn, setModalOn] = React.useState(false);
  const [modalType, setModalType] = React.useState(false);
  const [modalError, setModalError] = React.useState("");

  React.useEffect(() => {
    getStaffList().then((staffList) => {
      setListStaff(staffList);
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
    setModalType("Loading");
    setModalOn(true);
    if (choice == true) {
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
        goHome();
      }
    } else {
      const { error } = await result.json();
      console.log(error);
      setModalOn(false);
      setModalError(error);
      setModalType("Error");
      setModalOn(true);
    }
  }
  function goCheckIn() {
    window.location.href = "/checkIn";
  }
  function goCheckOut() {
    window.location.href = "/checkOut";
  }
  function goStaffList() {
    window.location.href = "/staffList";
  }
  function goAttendances() {
    window.location.href = "/attendances";
  }

  function onClickDeleteBtn(name) {
    setNameSelected(name);
    setModalChoices(true);
  }

  return (
    <section className="flex gap-0 bg-black">
      <div className="items-stretch flex flex-col w-full ">
        
        <div className=" px-16 py-16 font-[Montserrat]  flex flex-col h-screen ">
          <div className=" grow bg-white rounded-lg px-16 py-12 ">
            <div className="flex flex-col h-full items-center justify-center">
              <div className="flex-none mb-8">
                <h1 className="font-semibold text-3xl pb-4 justify-center">
                  Attendance Face Recognition App
                </h1>
              </div>
              <button
                className="w-96 flex-none flex flex-row w-full  justify-center my-2 px-6 py-4 border border-slate-300 rounded-lg items-center bg-blue-500 text-white font-semibold gap-4 hover:bg-blue-700 "
                onClick={(e) => {
                  e.preventDefault();
                  // selectDate(Moment(e).format("DD/MM/YYYY"));
                  goCheckIn();
                }}
              >
                <div className="flex-none ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">Check in</div>
              </button>
              <button
                className="w-96 flex-none flex flex-row w-full justify-center my-2 px-6 py-4 border border-slate-300 rounded-lg items-center bg-red-500 text-white font-semibold gap-4 hover:bg-red-700 "
                onClick={(e) => {
                  e.preventDefault();
                  // selectDate(Moment(e).format("DD/MM/YYYY"));
                  goCheckOut();
                }}
              >
                <div className="flex-none ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">Check out</div>
              </button>
              <button
                className="w-96 flex-none flex flex-row w-full justify-center my-2 px-6 py-4 border border-slate-300 rounded-lg items-center bg-slate-500 text-white font-semibold gap-4 hover:bg-slate-700 "
                onClick={(e) => {
                  e.preventDefault();
                  // selectDate(Moment(e).format("DD/MM/YYYY"));
                  goStaffList();
                }}
              >
                <div className="flex-none ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-6 h-6"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <div className="text-left">Staff List</div>
              </button>
              <button
                className="w-96 flex-none flex flex-row w-full justify-center my-2 px-6 py-4 border border-slate-300 rounded-lg items-center bg-slate-500 text-white font-semibold gap-4 hover:bg-slate-700 "
                onClick={(e) => {
                  e.preventDefault();
                  // selectDate(Moment(e).format("DD/MM/YYYY"));
                  goAttendances();
                }}
              >
                <div className="flex-none ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    className="w-6 h-6"
                  >
                    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">Attendances</div>
              </button>

              {/* {listStaff.map((name) => (
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
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
