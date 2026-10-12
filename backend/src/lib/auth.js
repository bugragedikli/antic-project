import { betterAuth } from "better-auth";
import pool from "../config/db.js";
import { APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";

// Returns the trimmed value or throws a 400 the client can show
const validateName = (value, label) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed.length === 0 || trimmed.length > 35) {
    throw new APIError("BAD_REQUEST", {
      message: `${label} must be 1-35 characters.`,
    });
  }
  return trimmed;
};

// Public display name: "Buğra G."
const buildDisplayName = (firstName, lastName) =>
  `${firstName} ${lastName.charAt(0).toUpperCase()}.`;

export const auth = betterAuth({
  plugins: [
    admin(),
  ],
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  trustedOrigins: [process.env.CLIENT_URL],
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const firstName = validateName(user.firstName, "First name");
          const lastName = validateName(user.lastName, "Last name");

          return {
            data: {
              ...user,
              firstName,
              lastName,
              name: buildDisplayName(firstName, lastName),
            },
          };
        },
      },
      update: {
        // Only the changed fields arrive here (e.g. just { emailVerified: true })
        before: async (user) => {
          // name is always derived from firstName/lastName, never set directly
          const { name, ...rest } = user;

          const hasFirst = rest.firstName !== undefined;
          const hasLast = rest.lastName !== undefined;

          if (!hasFirst && !hasLast) {
            return { data: rest };
          }

          // Both are needed to rebuild name, so they must be updated together
          if (!hasFirst || !hasLast) {
            throw new APIError("BAD_REQUEST", {
              message: "First name and last name must be updated together.",
            });
          }

          const firstName = validateName(rest.firstName, "First name");
          const lastName = validateName(rest.lastName, "Last name");

          return {
            data: {
              ...rest,
              firstName,
              lastName,
              name: buildDisplayName(firstName, lastName),
            },
          };
        },
      },
    },
  },
});
