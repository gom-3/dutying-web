import axios from 'axios';

const llmAxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/llm`,
    headers: {
        'Content-Type': 'application/json',
    },
    // LLM 동기 호출은 swagger 기준 10~30s 소요. 네트워크 지연·서버 hang 대비 60s로 상한.
    timeout: 60000,
});

export default llmAxiosInstance;
