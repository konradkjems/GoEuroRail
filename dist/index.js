"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectToDatabase)();
        // Your application logic here
        console.log('Server started successfully');
        // Example of model usage (commented out)
        /*
        const newCity = await City.create({
          name: 'Paris',
          country: 'France',
          latitude: 48.8566,
          longitude: 2.3522,
          station_codes: ['FRPAR', 'FRPNO'],
          timezone: 'Europe/Paris',
          region: 'Île-de-France',
          description: 'The City of Light'
        });
    
        const newUser = await User.create({
          email: 'traveler@example.com',
          password: 'securepassword123',
          home_city: newCity._id,
          travel_preferences: {
            prefer_night_trains: true,
            scenic_routes: true,
            low_budget: false
          }
        });
        */
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
//# sourceMappingURL=index.js.map