import React from 'react';
import icons from '../public/links.json'; // Adjust the import path as needed

const RightColumn: React.FC = () => {
    const handleClick = (url: string) => {
        window.open(url, '_blank'); // Opens the link in a new tab
    };

    return (
        <div className="columnContainer">
            {/* Iterate over the icons object and render each icon */}
            {Object.entries(icons).map(([iconName, iconData]) => (
                <div key={iconName} onClick={() => handleClick(iconData.url)} className="columnItem">
                    <img src={`/assets/${iconName}.svg`} alt={iconName} className="icon" />
                    <span className="iconTitle">{iconData.title}</span>
                </div>
            ))}
        </div>
    );
};

export default RightColumn;
