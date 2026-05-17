import { Queue } from "bullmq";
import IORedis from 'ioredis'

export const redisConnection = new IORedis(6379, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false
})

export const notificationQueue = new Queue("notifications", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: 100
    }
})