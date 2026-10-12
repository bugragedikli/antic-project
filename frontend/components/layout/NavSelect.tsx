"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BsCheck, BsChevronDown } from "react-icons/bs";

type Option = { value: string; label: string };

type NavSelectProps = {
    label: string;
    options: Option[];
    defaultValue: string;
};

export default function NavSelect({ label, options, defaultValue }: NavSelectProps) {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const id = useId();

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
    const selected = options[selectedIndex];

    // Close when clicking anywhere outside the dropdown
    useEffect(() => {
        if (!open) return;

        function handlePointerDown(e: PointerEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [open]);

    // Move keyboard focus into the list when it opens
    useEffect(() => {
        if (open) listRef.current?.focus();
    }, [open]);

    function openList() {
        setActiveIndex(selectedIndex);
        setOpen(true);
    }

    function close() {
        setOpen(false);
        buttonRef.current?.focus();
    }

    function choose(index: number) {
        setValue(options[index].value);
        close();
    }

    function handleButtonKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
        }
    }

    function handleListKeyDown(e: React.KeyboardEvent) {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, options.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case "Home":
                e.preventDefault();
                setActiveIndex(0);
                break;
            case "End":
                e.preventDefault();
                setActiveIndex(options.length - 1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                choose(activeIndex);
                break;
            case "Escape":
                e.preventDefault();
                close();
                break;
            case "Tab":
                setOpen(false);
                break;
        }
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={buttonRef}
                type="button"
                aria-label={`${label}: ${selected.label}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={handleButtonKeyDown}
                className="flex items-center gap-1.5 rounded-[1px] px-2 py-1 cursor-pointer outline-none hover:bg-white/10 focus-visible:bg-white/10"
            >
                <span>{selected.label}</span>
                <BsChevronDown
                    aria-hidden
                    className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    id={`${id}-list`}
                    role="listbox"
                    aria-label={label}
                    aria-activedescendant={`${id}-option-${activeIndex}`}
                    tabIndex={-1}
                    onKeyDown={handleListKeyDown}
                    className="absolute right-0 top-full z-50 mt-1 min-w-full rounded-[1px] bg-(--background-color) py-1 text-(--text-color) shadow-lg outline-none"
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === value;
                        const isActive = index === activeIndex;

                        return (
                            <li
                                key={option.value}
                                id={`${id}-option-${index}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => choose(index)}
                                onPointerMove={() => setActiveIndex(index)}
                                className={`flex items-center justify-between gap-4 whitespace-nowrap px-3 py-1.5 cursor-pointer ${
                                    isActive ? "bg-black/5" : ""
                                } ${isSelected ? "font-medium" : ""}`}
                            >
                                {option.label}
                                {isSelected && <BsCheck aria-hidden className="text-base" />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
