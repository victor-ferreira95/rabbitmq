import * as amqp from "amqplib";

async function worker() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "work_queue";
  await channel.assertQueue(queue);

  //prefetch = 1
  //round robin
  // prefetch = 1, significa que o worker vai receber apenas 1 mensagem por vez
  // round robin = significa que o worker vai receber as mensagens em ordem
  // se o worker não conseguir processar a mensagem, a mensagem fica na fila e o worker vai receber a próxima mensagem
  // se o worker conseguir processar a mensagem, a mensagem é removida da fila
  // o prefetch so funciona se o noAck for false
  channel.prefetch(1); 

  console.log(`[*] Worker aguardando tarefas. Para sair pressione CTRL+C`);

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(`[x] Recebido: ${content}`);

        const dots = content.split(".").length - 1;
        const timeToProcess = dots * 1000;

        // async
        setTimeout(() => {
          console.log(`[x] Tarefa concluída`);
          channel.ack(msg); // ack manual - confirma que a mensagem foi processada com sucesso
        }, timeToProcess); // 1 , 10 segundos
      }
    },
    { noAck: false } // noAck = false, significa que o worker vai enviar um ack manual para o broker
    // noAck = true, significa que o worker vai enviar um ack automático para o broker
  );
}

worker();