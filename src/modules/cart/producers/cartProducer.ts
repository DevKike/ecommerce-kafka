import { Partitioners } from "kafkajs";
import { kafka } from "../../../core/kafka/kafkaClient";



export const cartProducer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
})