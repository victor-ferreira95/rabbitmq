import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "hello";
  const message = "Hello World!";

  await channel.assertQueue(queue); // Cria a fila se não existir
  channel.sendToQueue(queue, Buffer.from(message)); // Envia a mensagem para a fila

  console.log(`[x] Sent ${message}`);

  setTimeout(() => {
    // regra: quando fecha a conexão, o canal é fechado automaticamente
    connection.close();
    process.exit(0);
  }, 500);
}

producer().catch(console.error);