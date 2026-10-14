import dotenv from "dotenv";

dotenv.config();

import app from "./app.ts";

const startServer = async () => {
    try{
        const server = app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

        server.on('error', (err) => {
            console.error('Server error:', err);
            throw err;
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

if(!process.env.BETTER_AUTH_SECRET) {
    console.error('BETTER_AUTH_SECRET is not set in the environment variables.');
    process.exit(1);
}

startServer();
