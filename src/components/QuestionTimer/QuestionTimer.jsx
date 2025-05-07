import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./QuestionTimer.css";

const QuestionTimer = forwardRef(({ questionIndex }, ref) => {
  // Helper to get the saved time for a question (in seconds)
  const getSavedTime = (qIdx) => {
    const savedTimers = JSON.parse(
      localStorage.getItem("testQuestionTimers") || "{}"
    );
    return savedTimers[qIdx] ? Math.floor(savedTimers[qIdx] / 1000) : 0;
  };

  const [timeSpent, setTimeSpent] = useState(() => {
    const t = getSavedTime(questionIndex);
    // console.log(`[Timer] INIT q${questionIndex}: ${t}s`);
    return t;
  });
  const intervalRef = useRef(null);

  // Expose getCurrentTime to parent
  useImperativeHandle(
    ref,
    () => ({
      getCurrentTime: () => timeSpent,
    }),
    [timeSpent]
  );

  // On question change, set timer state to value in localStorage
  useEffect(() => {
    const initialTime = getSavedTime(questionIndex);
    setTimeSpent(initialTime);
    // console.log(`[Timer] INIT/CHANGE q${questionIndex}: ${initialTime}s`);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        // Save to localStorage in ms
        const savedTimers = JSON.parse(
          localStorage.getItem("testQuestionTimers") || "{}"
        );
        savedTimers[questionIndex] = newTime * 1000;
        localStorage.setItem("testQuestionTimers", JSON.stringify(savedTimers));
        // console.log(`[Timer] TICK q${questionIndex}: ${newTime}s (saved)`);
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // On cleanup, always use the value from localStorage (most up-to-date)
      const savedTimers = JSON.parse(
        localStorage.getItem("testQuestionTimers") || "{}"
      );
      const localVal = savedTimers[questionIndex]
        ? Math.floor(savedTimers[questionIndex] / 1000)
        : 0;
      savedTimers[questionIndex] = localVal * 1000;
      localStorage.setItem("testQuestionTimers", JSON.stringify(savedTimers));
      console
        .log
        // `[Timer] CLEANUP q${questionIndex}: ${localVal}s (saved from localStorage)`
        ();
    };
    // eslint-disable-next-line
  }, [questionIndex]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="question-timer" title="Time spent on this question">
      {/* <i className="far fa-clock"></i>
      <span>{formatTime(timeSpent)}</span> */}
    </div>
  );
});

export default QuestionTimer;
