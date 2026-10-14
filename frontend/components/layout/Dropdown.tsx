import React, { useState, useEffect, useRef } from 'react';
import { BsChevronDown } from "react-icons/bs";

interface DropdownProps extends React.PropsWithChildren {
    content: React.ReactNode;
    hasArrow?: boolean;
};

const Dropdown = ({content, hasArrow = true, children}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!dropdownRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <div>
                <button
                    onClick={toggleDropdown}
                    className="font-medium hover:underline"
                >
                    {content}
                    {hasArrow && <BsChevronDown className="inline-block ml-1 text-xs" />}
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-left absolute right-0 mt-2 shadow-lg focus:outline-none"
                    role="menu"
                >
                    <div>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;