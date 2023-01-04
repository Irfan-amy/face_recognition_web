// import type { NextPage } from "next";
import Modal from "../components/Modal";
import ModalChoices from "../components/ModalChoices";
import React from "react";
import Moment from "moment";
// import video from "../statics/1.mp4";

const AttendancesPage = () => {
  const [listAttendance, setListAttendance] = React.useState([]);
  const [listDate, setListDate] = React.useState([]);
  const [modalChoices, setModalChoices] = React.useState(false);
  const [nameSelected, setNameSelected] = React.useState("");
  const [modalOn, setModalOn] = React.useState(false);
  const [modalType, setModalType] = React.useState(false);
  const [modalError, setModalError] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);

  React.useEffect(() => {
    getAttendances().then((attendances) => {
      setListAttendance(attendances);
      function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
      }
      let listDateString = attendances.map((e) => e.date);
      let listUniqueDateString = [...new Set(listDateString)];
      setListDate(
        listUniqueDateString.map((e) =>
          isValidDate(new Date(e)) ? new Date(e) : null
        )
      );
    });
  }, []);
  React.useEffect(() => {
    Moment.locale("en");
  }, []);
  async function getAttendances() {
    var result = await fetch("/api/getAttendances", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (result.status == 200) {
      const { attendances } = await result.json();
      return attendances;
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
  function goHome() {
    window.location.href = "/";
  }
  function goAddStaff() {
    window.location.href = "/registerStaff";
  }
  function goBack() {
    setSelectedDate(null);
  }
  function onClickDeleteBtn(name) {
    setNameSelected(name);
    setModalChoices(true);
  }

  function selectDate(date) {
    setSelectedDate(date);
  }
  return (
    <section className="flex gap-0 bg-black">
      <div className="items-stretch flex flex-col w-full ">
        <div className="flex flex-row self-end absolute w-full bottom-8 justify-center gap-4">
          {selectedDate ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                goBack();
              }}
              className="self-center bg-slate-500 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <></>
          )}
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
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </button>
        </div>
        <div className=" px-16 py-16 font-[Montserrat]  flex flex-col h-screen ">
          <div className=" grow bg-white rounded-lg px-16 py-12 overflow-y-auto">
            <div className="flex flex-col w-full">
              <div className="flex-none w-full text-3xl">
                <h1 className="font-semibold pb-4">
                  Attendances {selectedDate ? "- " + selectedDate : ""}
                </h1>
              </div>
              {!selectedDate &&
                listDate.map((e) =>
                  e ? (
                    <button
                      className="flex-none flex flex-row w-full my-2 px-6 py-4 border border-slate-300 rounded-lg items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        selectDate(Moment(e).format("DD/MM/YYYY"));
                      }}
                    >
                      <div className="grow text-left">
                        {Moment(e).format("DD/MM/YYYY")}
                      </div>
                      <div className="flex-none ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="#ef4444"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <></>
                  )
                )}
              {selectedDate ? (
                <div className="flex flex-col w-full my-2 px-6 py-4 border border-slate-300 rounded-lg gap-2">
                  <div className="flex-none flex flex-row items-center text-sm font-semibold">
                    <div className="flex basis-1/2">Name</div>
                    <div className="flex basis-1/4">Check in</div>
                    <div className="flex basis-1/4">Check out</div>
                  </div>
                  {listAttendance.map((e) =>
                    e.date == selectedDate ? (
                      <div className="flex-none flex flex-row text-base ">
                        <div className="flex basis-1/2">{e.name}</div>
                        <div className="flex basis-1/4">
                          {e.checkInTime
                            ? e.checkInTime
                            : "-"}
                        </div>
                        <div className="flex basis-1/4">
                          {e.checkOutTime
                            ? e.checkOutTime
                            : "-"}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              ) : (
                <></>
              )}
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

export default AttendancesPage;
