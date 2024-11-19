import { Kafka } from "kafkajs";
import { MongoClient } from "mongodb";

const kafka = new Kafka({
  clientId: "pacemaker-consumer",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "pacemaker-group" });

const mongoUrl = "mongodb://mongo:27017";
const dbName = "pacemakerData";
let db: any;
let pacemakerCollection: any;

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "pacemaker-data", fromBeginning: true });

  const client = new MongoClient(mongoUrl);
  await client.connect();
  console.log("[DEBUG] Connected to MongoDB");

  db = client.db(dbName);
  pacemakerCollection = db.collection("pacemakers");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value?.toString();
      console.log("Received message: ", messageValue);
      if(messageValue) {
        const parsedMessage = JSON.parse(messageValue);
        await pacemakerCollection.insertOne(parsedMessage);
        console.log("Message inserted in MongoDB: ", parsedMessage);
      } else {
        console.error("Invalid message received: ", messageValue);
      }
    },
  });
}

console.log("Consumer started");
startConsumer().catch(console.error);