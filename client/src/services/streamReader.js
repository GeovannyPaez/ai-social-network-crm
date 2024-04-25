async function* streamReader(response) {
    const stream = response.body;
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const decodedChunck = decoder.decode(value, { stream: true });
        yield decodedChunck;
    }
}

export default streamReader;