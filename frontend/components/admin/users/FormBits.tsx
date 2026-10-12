type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: string;
};

export const inputClassName =
    "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-(--primary-color) focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

export function Field({ label, hint, ...inputProps }: FieldProps) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
            <input {...inputProps} className={inputClassName} />
            {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
        </label>
    );
}

export function FormError({ message }: { message: string }) {
    if (!message) return null;

    return (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
        </p>
    );
}

type FormActionsProps = {
    onCancel: () => void;
    pending: boolean;
    submitLabel: string;
    // Red submit button for destructive actions like banning
    danger?: boolean;
};

export function FormActions({ onCancel, pending, submitLabel, danger }: FormActionsProps) {
    return (
        <div className="flex justify-end gap-2 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={pending}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                    danger ? "bg-red-600" : "bg-(--primary-color)"
                }`}
            >
                {pending ? "Saving..." : submitLabel}
            </button>
        </div>
    );
}
