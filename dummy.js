const mongoose = require("mongoose");

const outgoingSchema = new mongoose.Schema({
  rollNo: String,
  reason: String,
  time: Date,
  createdAt: Date,
  updatedAt: Date,
});

const Outgoing = mongoose.model("Outgoing", outgoingSchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/nps", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

// First, remove all existing outgoings
const clearOutgoings = async () => {
  try {
    await Outgoing.deleteMany({});
    console.log("Cleared existing outgoing data");
  } catch (err) {
    console.error("Error clearing outgoings:", err);
  }
};

// Create dummy outgoing entries
const dummyOutgoings = [
  {
    rollNo: "21BD1A0501",
    reason: "Medical appointment",
    time: new Date("2024-01-15T14:30:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    rollNo: "21BD1A0502",
    reason: "Family function",
    time: new Date("2024-01-16T11:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    rollNo: "21BD1A0503",
    reason: "Personal work",
    time: new Date("2024-01-17T15:45:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    rollNo: "21BD1A0504",
    reason: "Doctor appointment",
    time: new Date("2024-01-18T10:15:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    rollNo: "21BD1A0505",
    reason: "Family emergency",
    time: new Date("2024-01-19T13:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Insert new dummy data
const insertOutgoings = async () => {
  try {
    await clearOutgoings();
    const result = await Outgoing.insertMany(dummyOutgoings);
    console.log(`Successfully added ${result.length} outgoing entries`);
    mongoose.connection.close();
  } catch (err) {
    console.error("Error adding outgoings:", err);
    mongoose.connection.close();
  }
};

// Run the insertion
insertOutgoings();
