import { Partitioners } from "kafkajs";
import { kafka } from "../../../core/kafka/kafkaClient";



export const productProducer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
})