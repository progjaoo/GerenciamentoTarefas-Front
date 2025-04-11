import React, { useState, useEffect } from "react";

const TarefaForm = ({ onSubmit, tarefaSelecionada, limparSelecao }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [status, setStatus] = useState("Pendente");

  useEffect(() => {
    if (tarefaSelecionada) {
      setTitulo(tarefaSelecionada.titulo);
      setDescricao(tarefaSelecionada.descricao || "");
      setDataConclusao(tarefaSelecionada.dataConclusao?.substring(0, 10) || "");
      setStatus(tarefaSelecionada.status || "Pendente");
    }
  }, [tarefaSelecionada]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      titulo,
      descricao,
      dataConclusao,
      status
    });

    setTitulo("");
    setDescricao("");
    setDataConclusao("");
    setStatus("Pendente");
    limparSelecao();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{tarefaSelecionada ? "Editar Tarefa" : "Nova Tarefa"}</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        maxLength={100}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="date"
        value={dataConclusao}
        onChange={(e) => setDataConclusao(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pendente">Pendente</option>
        <option value="EmProgresso">EmProgresso</option>
        <option value="Concluída">Concluída</option>
      </select>
      <button type="submit">Salvar</button>
    </form>
  );
};

export default TarefaForm;
