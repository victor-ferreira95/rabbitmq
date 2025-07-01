import amqp from "amqplib";

async function startConsumer() {
  const conn = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await conn.createChannel();
  const exchange = "amq.topic";
  const queue = "log-all-orders-queue";
  const routingKey = "order.#";

  await channel.assertExchange(exchange, "topic");
  await channel.assertQueue(queue);
  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, (msg) => {
    if (msg) {
      console.log(`[log_all_orders] Received (${msg.fields.routingKey}):`, msg.content.toString());
      channel.ack(msg);
    }
  });
}

startConsumer();