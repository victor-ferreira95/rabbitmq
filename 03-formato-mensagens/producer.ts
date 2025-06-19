import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "products";
  const message = JSON.stringify({ id: 1, name: "Product A", price: 100 });

  // idempotente: se a fila já existir, não cria uma nova
  // filas são imutáveis
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message), {
    // contentType é o tipo de conteúdo da mensagem, é usado para indicar o tipo de dado que está sendo enviado
    contentType: "application/json",
  }); 

  console.log(`[x] Sent ${message}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

producer().catch(console.error);