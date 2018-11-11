const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI ||
        process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' +
        (process.env.MONGO_PORT || '27017') +
        '/jambslayer',
    facebook: {
        clientID: "4d191ba7e68963771d6e51fccadd82af",
        clientSecret: "564494234002564",
        profileFields: ['id', 'displayName', 'emails', 'photos'],
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }
}

export default config;