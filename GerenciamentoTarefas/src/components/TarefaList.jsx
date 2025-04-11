import React from "react";

const TarefaList = ({ tarefas, onEdit, onDelete }) => {
  if (tarefas.length === 0) return <p>Nenhuma tarefa encontrada.</p>;

  return (
    <ul>
      {tarefas.map((t) => (
        <li key={t.id}>
          <strong>{t.titulo}</strong> - {t.status}
          <br />
          <small>{t.descricao}</small>
          <br />
          <button onClick={() => onEdit(t)}>Editar</button>
          <button onClick={() => onDelete(t.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
};

export default TarefaList;
