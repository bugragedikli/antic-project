"use client";

import { useEffect, useRef } from "react";
import { BsX } from "react-icons/bs";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

// Native <dialog>: gives focus trapping, Escape to close and a backdrop for free
export default function Modal({ open, onClose, title, children }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            // A click whose target is the dialog itself landed on the backdrop
            onClick={(e) => e.target === ref.current && onClose()}
            className="m-auto w-full max-w-md rounded-md bg-white p-0 shadow-xl backdrop:bg-black/40"
        >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-800">{title}</h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="text-gray-400 hover:text-gray-600"
                >
                    <BsX className="size-6" />
                </button>
            </div>
            <div className="p-5">{open && children}</div>
        </dialog>
    );
}
