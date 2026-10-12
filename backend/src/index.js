import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

const startServer = async () => {
    try{
        app.on('error', (err) => {
            console.error('Server error:', err);
            throw err; 
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
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
