// Takes in mongoose object, connects to database using ATLAS_URI environment variable
// Exits app process if unable to connect
const connectDB = async (mongoose) => {
  try {
    // Create connection object
    const conn = await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    // Log host of connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log error and exit
    console.error(err);
    process.exit(1);
  }
};
// Export function
module.exports = connectDB;
