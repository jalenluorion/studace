import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUser, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons'; // Import the new icons
import { useNavigate } from 'react-router-dom';
import './Control.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function ControlContainer({
    space,
    viewOptions,
    showUserView,
    setShowUserView,
    showFarLeftView,
    setShowFarLeftView,
    showLeft1View,
    setShowLeft1View,
    showLeft2View,
    setShowLeft2View,
    showTopView,
    setShowTopView,
    showRight1View,
    setShowRight1View,
    showRight2View,
    setShowRight2View,
    showFarRightView,
    setShowFarRightView,
}) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [buttonRowDisplayed, setButtonRowDisplayed] = useState(true);
    const navigate = useNavigate();

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            // Request fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    };

    // Listen for changes in fullscreen state
    useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('msfullscreenchange', fullscreenChangeHandler);

        return () => {
            // Clean up event listeners
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('msfullscreenchange', fullscreenChangeHandler);
        };
    }, []);

    // eslint-disable-next-line
    const handleFarLeftViewClick = () => {
        setShowFarLeftView(!showFarLeftView);
    };

    const handleButtonBarClick = () => {
        setButtonRowDisplayed(!buttonRowDisplayed);
    };

    const handleLeft1ViewClick = () => {
        setShowLeft1View(!showLeft1View);
        if (showLeft2View) setShowLeft2View(false); // Close the other picker
    };

    const handleRight1ViewClick = () => {
        setShowRight1View(!showRight1View);
        if (showRight2View) setShowRight2View(false); // Close the other picker
    };

    const handleLeft2ViewClick = () => {
        setShowLeft2View(!showLeft2View);
        if (showLeft1View) setShowLeft1View(false); // Close the other picker
    };

    const handleRight2ViewClick = () => {
        setShowRight2View(!showRight2View);
        if (showRight1View) setShowRight1View(false); // Close the other picker
    };

    const handleTopViewClick = () => {
        setShowTopView(!showTopView);
    };

    const handleFarRightViewClick = () => {
        setShowFarRightView(!showFarRightView);
    };

    const handleLoginButtonClick = () => {
        if (space != null) {
            setShowUserView(!showUserView);
        } else {
            navigate("login", {state: {button: true, visible: true}})
        }
    }

    return (
        <div className="control-container">
            <div className="control-title">
                <button className="">
                    <i className="bi bi-grid-fill"></i>
                </button>
                <button className="" onClick={handleLoginButtonClick}>
                    <FontAwesomeIcon icon={faUser} fixedWidth />
                </button>
                <h1>{space == null ? "Virtual Study Space" : space.name}</h1>
                <button className="" onClick={handleButtonBarClick}>
                    <FontAwesomeIcon icon={buttonRowDisplayed ? faChevronDown : faChevronUp} fixedWidth />
                </button>
                <button className="" onClick={toggleFullScreen}>
                    <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} fixedWidth />
                </button>
            </div>
            <div className={`button-row ${buttonRowDisplayed ? '' : 'button-row-hidden'}`}>
                <button className="control-button button4">
                    <FontAwesomeIcon icon={viewOptions.farLeftView.icon} />
                    <span className="button-label">{viewOptions.farLeftView.label}</span>
                </button>
                <div className="view-picker">
                    <button className={`control-button button1 ${showLeft1View ? 'active' : ''}`} onClick={handleLeft1ViewClick}>
                        <FontAwesomeIcon icon={viewOptions.left1View.icon} />
                        <span className="button-label">{viewOptions.left1View.label}</span>
                    </button>
                    <button className={`control-button button1 ${showLeft2View ? 'active' : ''}`} onClick={handleLeft2ViewClick}>
                        <FontAwesomeIcon icon={viewOptions.left2View.icon} />
                        <span className="button-label">{viewOptions.left2View.label}</span>
                    </button>
                </div>
                <button className={`control-button button3 ${showTopView ? 'active' : ''}`} onClick={handleTopViewClick}>
                    <FontAwesomeIcon icon={viewOptions.topView.icon} />
                    <span className="button-label">{viewOptions.topView.label}</span>
                </button>
                <div className="view-picker">
                    <button className={`control-button button2 ${showRight1View ? 'active' : ''}`} onClick={handleRight1ViewClick}>
                        <FontAwesomeIcon icon={viewOptions.right1View.icon} />
                        <span className="button-label">{viewOptions.right1View.label}</span>
                    </button>
                    <button className={`control-button button2 ${showRight2View ? 'active' : ''}`} onClick={handleRight2ViewClick}>
                        <FontAwesomeIcon icon={viewOptions.right2View.icon} />
                        <span className="button-label">{viewOptions.right2View.label}</span>
                    </button>
                </div>
                <button className={`control-button button5 ${showFarRightView ? 'active' : ''}`} onClick={handleFarRightViewClick}>
                    <FontAwesomeIcon icon={viewOptions.farRightView.icon} />
                    <span className="button-label">{viewOptions.farRightView.label}</span>
                </button>
            </div>
        </div>
    );
}

export default ControlContainer;
