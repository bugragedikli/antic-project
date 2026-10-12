"use client";

import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import UserFormDialog from "./UserFormDialog";

export default function CreateUserButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-md bg-(--primary-color) px-4 py-2 text-sm font-medium text-white"
            >
                <BsPlusLg className="size-4" />
                New User
            </button>
            <UserFormDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
}
