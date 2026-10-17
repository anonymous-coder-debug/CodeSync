import api from './api';

export const executeCode = (payload) => api.post('/code/execute', payload).then((res) => res.data);
