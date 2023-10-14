import React from 'react';
import icons from '../public/links.json'; // Adjust the import path as needed
import 'styles/Links.css';

const Links: React.FC = () => {
    const handleClick = (url: string) => {
        window.open(url, '_blank'); // Opens the link in a new tab
    };

    return (
        <div className="rowContainer">
            {/* Iterate over the icons object and render each icon */}
            {Object.entries(icons).map(([iconName, iconData]) => (
                <div
                    key={iconName} onClick={() => handleClick(iconData.url)}
                    className="rowItem"
                    title={iconData.title}>
                    <img src={iconData.address} alt={iconName} className="icon" />
                </div>
            ))}
        </div>
    );
};

export default Links;
