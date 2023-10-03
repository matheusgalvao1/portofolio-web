import React, { CSSProperties } from 'react';
import icons from '../public/links.json'; // Adjust the import path as needed

const RightColumn: React.FC = () => {
    const containerStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '10%', // Adjusted width to accommodate text
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '3%',
    };

    const textStyle: CSSProperties = {
        marginLeft: '10%', // Space between the icon and the text
        fontSize: '1em', // Adjust the font size as needed
        lineHeight: '1', // Adjust the line height as needed
    };

    const itemStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer', // Make the entire item clickable
        height: '7%', // or whatever height you find appropriate
    };

    const iconStyle: CSSProperties = {
        width: '20%', // or adjust as necessary
        height: '100%', // taking the full height of the container
        marginBottom: '10%',
    };

    // Example click handler
    const handleClick = (url: string) => {
        window.open(url, '_blank'); // Opens the link in a new tab
    };

    return (
        <div style={containerStyle}>
            {/* Iterate over the icons object and render each icon */}
            {Object.entries(icons).map(([iconName, iconData]) => (
                <div key={iconName} onClick={() => handleClick(iconData.url)} style={itemStyle}>
                    <img src={`/assets/${iconName}.svg`} alt={iconName} style={iconStyle} />
                    <span style={textStyle}>{iconData.title}</span>
                </div>
            ))}
        </div>
    );
};

export default RightColumn;
