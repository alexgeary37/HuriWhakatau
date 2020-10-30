import {Segment, Sidebar} from "semantic-ui-react";
import React from "react";

export const Sidebars = () => {

    return (
        <div>
            <Sidebar
                as={Segment}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                visible
                width={"very thin"}
                style={{
                    backgroundColor: 'rgb(30, 30, 30)',
                    backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                    backgroundSize: '60px',
                    backgroundRepeat: 'repeat-y'
                }}
            />
            <Sidebar
                as={Segment}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                direction={'right'}
                visible
                width={"very thin"}
                style={{
                    backgroundColor: 'rgb(30, 30, 30)',
                    backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                    backgroundSize: '60px',
                    backgroundRepeat: 'repeat-y'
                }}
            />
        </div>
    );
}
