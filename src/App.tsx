import { useState } from "react";
// import { useInterval } from "./use-interval";
import { useSynchronizedInterval } from "./use-synchronized-interval";

function App() {
  return (
    <>
      <div className="p-24 space-y-5">
        <FlashingLight />
        <ProgressIndicator />
      </div>
    </>
  );
}

//
// Flashing light
//
const FlashingLight = () => {
  const [isOn, setIsOn] = useState(false);
  const [index, setIndex] = useState(0);

  const colors = [
    "bg-red-500 shadow-red-500/50",
    "bg-blue-500 shadow-blue-500/50",
    "bg-green-500 shadow-green-500/50",
    "bg-pink-500 shadow-pink-500/50",
    "bg-purple-500 shadow-purple-500/50",
  ];

  const changeColor = () => {
    setIndex((index) => (index + 1) % colors.length);
  };

  useSynchronizedInterval(
      changeColor,
    isOn ? 1000 : null
  );

  return (
    <button
      className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 transition-colors shadow-lg ${colors[index]}`}
      onClick={() => {
        if (!isOn) {
          changeColor();
        }
        setIsOn((isOn) => !isOn);
      }}
    >
      {isOn ? "Stop" : "Start"}
    </button>
  );
};

//
// Progress indicator
//
const BOXES_COUNT = 10;

const ProgressIndicator = () => {
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    setProgress((index) => (index + 1) % BOXES_COUNT);
  };

  useSynchronizedInterval(() => {
    updateProgress();
  }, 1000);

  return (
    <div className="flex gap-1">
      {[...Array(progress)].map(() => (
        <div className="w-4 h-4 bg-black border border-black" />
      ))}
      {[...Array(BOXES_COUNT - progress)].map(() => (
        <div className="w-4 h-4 bg-white border border-black" />
      ))}
    </div>
  );
};

export default App;
