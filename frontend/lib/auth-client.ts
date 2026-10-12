import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                firstName: { type: "string" },
                lastName: { type: "string" },
            },
        }),
        adminClient(),
    ],
});
