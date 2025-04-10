import axios from "axios";

const API_BASE = "https://localhost:44300/api/tarefas";

const tarefaService = {
    getAll: async () => {
      const response = await axios.get(`${API_BASE}/buscarTodasTarefas`);
      return response.data;
    },
    getByStatus: async (status) => {
      const response = await axios.get(`${API_BASE}/tarefaPorStatus?tarefa=${status}`);
      return response.data;
    },
    getById: async (id) => {
      const response = await axios.get(`${API_BASE}/${id}/tarefasPorId`);
      return response.data;
    },
  
    create: async (tarefa) => {
      const response = await axios.post(`${API_BASE}/criarTarefa`, tarefa);
      return response.data;
    },
  
    update: async (id, tarefa) => {
      const response = await axios.put(`${API_BASE}/${id}/atualizarTarefa`, tarefa);
      return response.data;
    },
  
    delete: async (id) => {
      const response = await axios.delete(`${API_BASE}/${id}/atualizarTarefa`);
      return response.data;
    },
    finalizar: async (id, payload) => {
      const response = await axios.put(`${API_BASE}/${id}/finalizarTarefa`, payload)
      return response.data
    },
    
  };
  
  export default tarefaService;