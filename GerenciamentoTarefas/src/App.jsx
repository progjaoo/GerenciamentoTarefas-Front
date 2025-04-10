import { useEffect, useState } from 'react'
import './App.css'
import tarefaService from './services/tarefaService'

const statusTarefaMap = {
  0: 'PENDENTE',
  1: 'EM PROGRESSO',
  2: 'CONCLUÍDA'
}

function App() {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('Pendente')
  const [editandoId, setEditandoId] = useState(null)
  const [datasConclusao, setDatasConclusao] = useState({}) // <- Estado para armazenar as datas de conclusão

  useEffect(() => {
    buscarTarefas()
  }, [])

  const buscarTarefas = async () => {
    const data = await tarefaService.getAll()
    setTarefas(data)
  }

  const salvarOuEditarTarefa = async () => {
    const statusMapReverse = {
      Pendente: 0,
      'Em Progresso': 1,
      Concluída: 2
    }

    const tarefaPayload = {
      titulo,
      descricao,
      status: statusMapReverse[status],
      dataConclusao: null
    }

    if (editandoId) {
      await tarefaService.update(editandoId, {
        id: editandoId,
        ...tarefaPayload
      })
      alert('Tarefa editada com sucesso')
    } else {
      await tarefaService.create(tarefaPayload)
    }

    setTitulo('')
    setDescricao('')
    setStatus('Pendente')
    setEditandoId(null)
    buscarTarefas()
  }

  const editarTarefa = (tarefa) => {
    setEditandoId(tarefa.id)
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao)
    const statusStringMap = {
      0: 'Pendente',
      1: 'Em Progresso',
      2: 'Concluída'
    }
    setStatus(statusStringMap[tarefa.status])
  }

  const deletarTarefa = async (id) => {
    const confirmacao = confirm('Tem certeza que deseja excluir esta tarefa?')
    if (!confirmacao) return

    await tarefaService.delete(id)
    buscarTarefas()
  }

  const finalizarTarefa = async (id) => {
    const dataConclusao = datasConclusao[id]
    if (!dataConclusao) {
      alert("Selecione uma data antes de finalizar a tarefa.")
      return
    }
  
    await tarefaService.finalizar(id, {
      id: id,
      dataConclusao: dataConclusao
    })
    alert('Tarefa concluída com sucesso')
    buscarTarefas()
  }

  return (
    <div className="main-container">
      <div className="card">
        <h1>To-Do List</h1>

        <div className="form">
  <input
    type="text"
    placeholder="Título da tarefa"
    value={titulo}
    onChange={(e) => setTitulo(e.target.value)}
  />
  <input
    type="text"
    placeholder="Descrição"
    value={descricao}
    onChange={(e) => setDescricao(e.target.value)}
  />

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <button
    style={{ flex: 1, maxWidth: '50%' }}
    onClick={salvarOuEditarTarefa}
  >
    {editandoId ? 'Editar' : 'Adicionar'}
  </button>

  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <label htmlFor="statusFilter"><strong>Filtro:</strong></label>
    <select
      id="statusFilter"
      value={status}
      onChange={async (e) => {
        const novoStatus = e.target.value
        setStatus(novoStatus)

        const statusMapReverse = {
          Pendente: 0,
          'Em Progresso': 1,
          Concluída: 2
        }

        const statusEnum = statusMapReverse[novoStatus]
        const data = await tarefaService.getByStatus(statusEnum)
        setTarefas(data)
      }}
    >
      <option value="Pendente">Pendente</option>
      <option value="Em Progresso">Em Progresso</option>
      <option value="Concluída">Concluída</option>
    </select>
  </div>
</div>
</div>


        {/* LISTAGEM DE TAREFAS */}
        {tarefas.map((tarefa) => (
          <div className="task" key={tarefa.id}>
            <div>
              <strong>Tarefa: {tarefa.titulo}</strong>
              <p>Descrição: {tarefa.descricao}</p>
              <p>Status: {statusTarefaMap[tarefa.status]}</p>
            </div>
            <div className="task-actions">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <input
                  type="date"
                  title="Definir data de conclusão"
                  value={datasConclusao[tarefa.id] || ''}
                  onChange={(e) => {
                    setDatasConclusao((prev) => ({
                      ...prev,
                      [tarefa.id]: e.target.value
                    }))
                  }}
                />
                {tarefa.status === 2 && tarefa.dataConclusao && (
                  <p style={{ color: 'lightgreen', marginTop: '5px', fontSize: '12px' }}>
                    Concluída em: {new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              <button onClick={() => finalizarTarefa(tarefa.id)}>✔️</button>
              <button onClick={() => editarTarefa(tarefa)}>✏️</button>
              <button onClick={() => deletarTarefa(tarefa.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
