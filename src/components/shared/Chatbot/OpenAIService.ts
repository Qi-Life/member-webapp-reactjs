
import apiClient1 from '~/configs/apiClient1';

const createThread = async () => {
    return await  apiClient1.post('/api/openai/create_thread');

}

const addMessageToThread = async (thread: string, message: string) => {
    return await  apiClient1.post('/api/openai/add_message', {
        thread_id: thread,
        message
    });
}


const deleteThread = async (thread: string) => {
    return await  apiClient1.post('api/openai/delete_thread', {
        thread_id: thread
    });
}

const runThread = async (thread: string) => {
    return await  apiClient1.post('/api/openai/run_thread', {
        thread_id: thread,
    });
}

export { createThread, deleteThread, addMessageToThread, runThread }