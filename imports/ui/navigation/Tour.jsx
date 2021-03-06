// Tour component from https://blog.logrocket.com/complete-guide-to-build-product-tours-on-your-react-apps/
import Joyride, {BeaconRenderProps, TooltipRenderProps, ACTIONS, EVENTS, STATUS} from 'react-joyride';
import React from "react";
import Cookies from "universal-cookie/lib";

export const Tour = ({TOUR_STEPS}) => {

    const handleCallback = (data) => {
        const {status, step, action} = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            const cookies = new Cookies();
            if (document.title === "User Settings") {
                cookies.set('pepehaTour', 'complete', {path: '/'});
            } else if (document.title === "My Dashboard") {
                cookies.set('myDashTour', 'complete', {path: '/'});
            } else if (document.title === "Home") {
                cookies.set('signup', 'complete', {path: '/'});
            } else if (document.title.indexOf("Hui") !== -1) {
                cookies.set("huichatTour", 'complete', {path: '/'});
            }
        }
    }

    return (
        <Joyride
            callback={(data) => handleCallback(data)}
            steps={TOUR_STEPS}
            continuous={true}
            showSkipButton={true}
            scrollToFirstStep={true}
            showProgress={true}
            locale={{
                last: "Tour End",
                skip: "Stop tour"
            }}
            styles={{
                tooltipContainer: {
                    textAlign: "left"
                },
                buttonSkip: {
                    color: "red"
                },
                buttonNext: {
                    backgroundColor: "red"
                },
                buttonBack: {
                    color: "red",
                    marginRight: 10
                },
                options: {
                    // arrowColor: '#e3ffeb',
                    // backgroundColor: '#e3ffeb',
                    position: 'relative',
                    beaconSize: 70,
                    // overlayColor: 'rgba(79, 26, 0, 0.4)',
                    primaryColor: 'yellow',
                    // textColor: '#004a14',
                    // width: 900,
                    zIndex: 1000,
                }
            }}
        />
    );
};
