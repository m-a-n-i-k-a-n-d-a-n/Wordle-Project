import { useState } from "react";
import "./NavBar.css";

function NavBar({ ITEMS, setActivePageIndex }) {
    const [active, setActive] = useState(0);

    function handleClick(index) {
        setActive(index);
        setActivePageIndex(index);
    }
    return (
        <div className="nav-bar-container">
            <div className="nav-bar">
                {/* Website name on the left */}
                <div class="wordle-logo">
                    <span>W</span>
                    <span>O</span>
                    <span>R</span>
                    <span>D</span>
                    <span>L</span>
                    <span>E</span>
                </div>


                {/* Navigation items on the right */}
                <div className="nav-items">
                    {ITEMS.map((val, idx) => (
                        <div
                            key={idx}
                            className={"item " + (idx === active ? " active" : "")}
                            onClick={() => handleClick(idx)}
                        >
                            <div className="icon">{val.icon}</div>
                            <div className="text">{val.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NavBar;