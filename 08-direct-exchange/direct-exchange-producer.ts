import * as amqp from "amqplib";

interface OrderEvent {
  id: number;
  customer: string;
  event: string;
}

// exchange direto
// exchange direto é um tipo de exchange que envia mensagens para um ou mais queues com base em uma chave de roteamento

// caso de uso: eventos de pedidos, fatos no passado, eventos de log, etc.
async function sendOrderEvents() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "xpto.direct";
    // immutable - não pode ser alterado depois de criado
  await channel.assertExchange(exchange, "direct");

  const ordersEvent: OrderEvent[] = [
    { id: 101, customer: "Alice", event: "order.created" },
    { id: 102, customer: "Bob", event: "order.updated" },
    { id: 103, customer: "Carol", event: "order.created" },
  ];

  for (let i = 0; i < ordersEvent.length; i++) {
    const order = ordersEvent[i];

    const routingKey = order.event;
    const message = JSON.stringify(order);
    await channel.publish(exchange, routingKey, Buffer.from(message) );
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendOrderEvents();