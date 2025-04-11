import React, { useEffect, useState } from "react";
import tarefaService from "../services/tarefaService";

const TarefaPage = () => {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    loadTarefas();
  }, []);

  const loadTarefas = async () => {
    try {
      const data = await tarefaService.getAll();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>
            <strong>{tarefa.titulo}</strong> - {tarefa.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TarefaPage;
