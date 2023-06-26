<template>
  <div>
    <pre>
      {{ messages }}
    </pre>
  </div>
</template>
<script setup lang="ts">
const messages = ref<unknown[]>([]);

function updateMsgs(e: MessageEvent) {
  messages.value.push({
    data: e.data,
    origin: e.origin,
  });
}
const EVENT_NAME = "update";

if (typeof window.EventSource !== "undefined") {
  let source: EventSource | undefined;

  onMounted(() => {
    source = new window.EventSource("/api/sse");
    source.addEventListener(EVENT_NAME, updateMsgs, false);

    source.onerror = (err) => {
      console.log("Something wrong append", err);
      source?.removeEventListener(EVENT_NAME, updateMsgs);
      source?.close();
      source = undefined;
    };

    console.log("New eventSource: ", source.url);
  });

  onBeforeUnmount(() => {
    if (source) {
      console.log("Remove eventSource", source.url);
      source.removeEventListener(EVENT_NAME, updateMsgs);
      source.close();
      source = undefined;
    }
  });
}
</script>
