import { env } from "./config/env.ts";
import app from "./app.ts";

const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
});
