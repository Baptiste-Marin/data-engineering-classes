import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "pacemaker-simulator",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer({
    allowAutoTopicCreation: false,
});

async function startProducer() {
  await producer.connect();

  setInterval(async() => {
    const message = {
        pacemakerId: Math.floor(Math.random() * 1000),
        date: new Date().toISOString(),
        alertLevel: Math.floor(Math.random() * 4) + 1,
        heartRate: Math.floor(Math.random() * 100),
        bodyTemperature: Math.floor(Math.random() * 10) + 35,
    }

    try {
        await producer.send({
            topic: "pacemaker-data",
            messages: [{ value: JSON.stringify(message) }],
        });
        //console.log("Message sent: ", message);
        } catch (error) {
        console.error("Error when sending message: ", error);
    }
  }, 6000);
}

console.log("Producer started");
console.log();
startProducer().catch(console.error);