export default fromNodeMiddleware((_req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  let i = 0;

  const interval = setInterval(() => {
    const event = {
      id: i,
      data: `Event ${i} at ${new Date().toISOString()}`,
      event: "update",
    };
    res.write(`id: ${event.id}\n`);
    res.write(`data: { foo: '${event.data}' }\n`);
    res.write(`event: ${event.event}\n\n`);
    i++;
    if (i === 20) {
      const closeEvent = {
        event: "close",
        data: "Stream closed",
      };
      res.write(`event: ${closeEvent.event}\n`);
      res.write(`data: ${closeEvent.data}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 1000);
});
