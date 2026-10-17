import api from './api';

export const createRoom = (payload) => api.post('/rooms', payload).then((res) => res.data);

export const getRoom = (roomId) => api.get(`/rooms/${roomId}`).then((res) => res.data);

export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`).then((res) => res.data);

export const leaveRoom = (roomId) => api.delete(`/rooms/${roomId}/leave`).then((res) => res.data);

export const getMyRooms = () => api.get('/rooms/mine/recent').then((res) => res.data);

export const getRoomMessages = (roomId) => api.get(`/rooms/${roomId}/messages`).then((res) => res.data);
