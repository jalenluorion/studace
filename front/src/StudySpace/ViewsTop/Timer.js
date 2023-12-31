import React, { useState, useEffect, useRef } from 'react';
import './ViewsTop.css';
import './Timer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { CSSTransition } from 'react-transition-group';
import { api } from '../../Helper';

const TimerView = ({ visible }) => {
  const [studyTime, setStudyTime] = useState(1500); // Initial study time in seconds (25 minutes)
  const [breakTime, setbreakTime] = useState(300); // Initial break time in seconds (5 minutes)
  const [timerLabel, setTimerLabel] = useState('Study');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);
  const [currentMinutes, setCurrentMinutes] = useState('25');
  const [buttonClicked, setButtonClicked] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const savedTimerState = Cookies.get('timerState');
    if (savedTimerState === "paused") {
      setIsActive(true);
      setIsPaused(true);
    } else if (savedTimerState === "active") {
      setIsActive(true);
      setIsPaused(false);
    } else {
      setIsActive(false);
      setIsPaused(true);
    }

    const savedStudyTime = parseInt(Cookies.get('studyTime'), 10);
    if (!isNaN(savedStudyTime)) {
      setStudyTime(savedStudyTime);
    }

    const savedBreakTime = parseInt(Cookies.get('breakTime'), 10);
    if (!isNaN(savedBreakTime)) {
      setbreakTime(savedBreakTime);
    }

    const savedTimerLabel = Cookies.get('timerLabel');
    if (savedTimerLabel === 'Study' || savedTimerLabel === 'Break') {
      setTimerLabel(savedTimerLabel);
    }
  }, []);

  useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        if (timerLabel === 'Study' && studyTime > 0) {
          setStudyTime(studyTime - 1);
        } else if (timerLabel === 'Break' && breakTime > 0) {
          setbreakTime(breakTime - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Clear the interval when the timer reaches zero
    if (!isPaused && studyTime === 0 && timerLabel === 'Study') {
      clearInterval(interval);
      setIsActive(false);
      setIsPaused(true);
      api.patch('/stats', { timersFinished: 1 }, { withCredentials: true });
      setTimeout(() => {
        alert("Your study timer has finished. Go take a break!");
        setTimerLabel('Break');
        setCurrentMinutes(String(breakTime / 60));
        setStudyTime(1500);
      }, 100); // Delay the alert for 1 second after reaching zero
    }

    if (!isPaused && breakTime === 0 && timerLabel === 'Break') {
      clearInterval(interval);
      setIsActive(false);
      setIsPaused(true);
      api.patch('/stats', { timersFinished: 1 }, { withCredentials: true });
      setTimeout(() => {
        alert("Your break timer has finished. Go study some more!");
        setTimerLabel('Study');
        setCurrentMinutes(String(studyTime / 60));
        setbreakTime(300);
      }, 100); // Delay the alert for 1 second after reaching zero
    }

    Cookies.set('timerState', isActive ? (isPaused ? 'paused' : 'active') : 'inactive', { expires: 7 });
    Cookies.set('studyTime', studyTime.toString(), { expires: 7 });
    Cookies.set('breakTime', breakTime.toString(), { expires: 7 });
    Cookies.set('timerLabel', timerLabel, { expires: 7 });
    return () => clearInterval(interval);
  }, [isActive, isPaused, studyTime, breakTime, timerLabel]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !buttonClicked) {
        setTimePickerOpen(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonClicked]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(true);
    if (timerLabel === 'Break') {
      setbreakTime(300);
      setCurrentMinutes('5');
    } else if (timerLabel === 'Study') {
      setCurrentMinutes('25');
      setStudyTime(1500);
    }
  };

  const toggleTimePicker = (e) => {
    if (!isActive) {
      setButtonClicked(true);
      setTimePickerOpen(!isTimePickerOpen);
    }
  };

  const updateTimePickerValue = () => {
    const newTotalSeconds = parseInt(currentMinutes, 10) * 60;
    if (timerLabel === 'Study') {
      setStudyTime(newTotalSeconds);
    } else if (timerLabel === 'Break') {
      setbreakTime(newTotalSeconds);
    }
    setTimePickerOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateTimePickerValue();
    }
  };

  const tagButtons = (
    <div className="timer-label">
      <button
        className={`tag-button ${isActive ? 'disabled' : ''}`}
        style={{
          backgroundColor: timerLabel === 'Study' ? 'red' : ''
        }}
        onClick={() => {
          if (!isActive) {
            setTimerLabel('Study');
            setCurrentMinutes(String(studyTime / 60));
          }
        }}
      >
        Study
      </button>
      <button
        className={`tag-button ${isActive ? 'disabled' : ''}`}
        style={{
          backgroundColor: timerLabel === 'Break' ? 'red' : '',
          color: timerLabel === 'Break' ? 'white' : '',
        }}
        onClick={() => {
          if (!isActive) {
            setTimerLabel('Break');
            setCurrentMinutes(String(breakTime / 60));
          }
        }}
      >
        Break
      </button>
    </div>
  );

  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="slide-bottom"
      unmountOnExit
    >
      <div className="container-top nobottom-top">
        <div className="top-bar">
          <div className="title centered">
            <h1>Pomodoro Timer</h1>
          </div>
          {isTimePickerOpen && (
            <div ref={menuRef} className="menu-dropdown-top red-accent">
              <input
                type="number"
                size="1"
                min="1"
                max="999"
                placeholder="Minutes"
                value={currentMinutes}
                onChange={(e) => setCurrentMinutes(e.target.value)}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                onKeyDown={handleKeyPress}
              />
              <button onClick={updateTimePickerValue}>Set</button>
            </div>
          )}
        </div>
        <div className="timer-body main-body">
          <div className="timer-display" onClick={toggleTimePicker}>
            <span className={`timer ${isActive ? 'disabled' : ''}`}>{formatTime(timerLabel === 'Study' ? studyTime : breakTime)}</span>
          </div>
          {isActive ? (
            <div className="btn-group">
              <button className="btn btn-pause" onClick={togglePause}>
                {isPaused ? (
                  <FontAwesomeIcon icon={faPlay} />
                ) : (
                  <FontAwesomeIcon icon={faPause} />
                )}
              </button>
              <button className="btn btn-reset" onClick={resetTimer}>
                <FontAwesomeIcon icon={faStop} />
              </button>
            </div>
          ) : (
            <div className="btn-group">
              <button className="btn btn-start" onClick={startTimer}>
                <FontAwesomeIcon icon={faHourglassStart} />
              </button>
            </div>
          )}
          {tagButtons}
        </div>
      </div>
    </CSSTransition>
  );
};

export default TimerView;