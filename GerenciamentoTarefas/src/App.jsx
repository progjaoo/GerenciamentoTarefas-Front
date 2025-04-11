import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
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
  const [datasConclusao, setDatasConclusao] = useState({})

  useEffect(() => {
    buscarTarefas()
  }, [])

  const buscarTarefas = async () => {
    const data = await tarefaService.getAll()
    setTarefas(data)
    sincronizarDatasConclusao(data)
  }

  const sincronizarDatasConclusao = (tarefas) => {
    const datas = {}
    tarefas.forEach(t => {
      if (t.dataConclusao) {
        const date = new Date(t.dataConclusao)
        datas[t.id] = date.toISOString().split('T')[0] // yyyy-MM-dd
      }
    })
    setDatasConclusao(datas)
  }

  const salvarOuEditarTarefa = async () => {
    if (!titulo.trim()) {
      Swal.fire("Campo obrigatório", "O título é obrigatório.", "warning")
      return
    }

    if (titulo.length > 100) {
      Swal.fire("Limite excedido", "O título deve ter no máximo 100 caracteres.", "warning")
      return
    }

    if (!descricao.trim()) {
      Swal.fire("Campo obrigatório", "A descrição é obrigatória.", "warning")
      return
    }

    if (descricao.length > 100) {
      Swal.fire("Limite excedido", "A descrição deve ter no máximo 100 caracteres.", "warning")
      return
    }

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

    try {
      if (editandoId) {
        await tarefaService.update(editandoId, {
          id: editandoId,
          ...tarefaPayload
        })
        Swal.fire("Editado", "Tarefa editada com sucesso!", "success")
      } else {
        await tarefaService.create(tarefaPayload)
        Swal.fire("Adicionada", "Tarefa criada com sucesso!", "success")
      }

      setTitulo('')
      setDescricao('')
      setStatus('Pendente')
      setEditandoId(null)
      buscarTarefas()
    } catch (error) {
      Swal.fire("Erro", "Erro ao salvar a tarefa. Verifique os dados e tente novamente.", "error")
      console.error(error)
    }
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
    const confirmacao = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá desfazer isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmacao.isConfirmed) return

    try {
      await tarefaService.delete(id)
      Swal.fire("Excluída", "Tarefa excluída com sucesso!", "success")
      buscarTarefas()
    } catch (error) {
      Swal.fire("Erro", "Erro ao excluir a tarefa.", "error")
      console.error(error)
    }
  }

  const finalizarTarefa = async (id) => {
    const dataConclusao = datasConclusao[id]
    if (!dataConclusao) {
      Swal.fire("Erro", "Selecione uma data antes de finalizar a tarefa.", "error")
      return
    }

    const tarefa = tarefas.find(t => t.id === id)
    if (!tarefa) {
      Swal.fire("Erro", "Tarefa não encontrada.", "error")
      return
    }

    const dataCriacao = new Date(tarefa.dataCriacao)
    const dataSelecionada = new Date(dataConclusao)

    dataCriacao.setHours(0, 0, 0, 0)
    dataSelecionada.setHours(0, 0, 0, 0)

    if (dataSelecionada < dataCriacao) {
      Swal.fire("Data inválida", "A data de conclusão não pode ser anterior à data de criação!", "warning")
      return
    }

    try {
      await tarefaService.finalizar(id, {
        id,
        dataConclusao
      })
      Swal.fire("Sucesso", "Tarefa concluída com sucesso!", "success")
      buscarTarefas()
    } catch (error) {
      Swal.fire("Erro", "Erro ao finalizar a tarefa. Tente novamente.", "error")
      console.error(error)
    }
  }

  const filtrarPorStatus = async (novoStatus) => {
    setStatus(novoStatus)
  
    const statusMapReverse = {
      Pendente: 0,
      'Em Progresso': 1,
      Concluída: 2
    }
  
    const statusEnum = statusMapReverse[novoStatus]
    const data = await tarefaService.getByStatus(statusEnum)
  
    setTarefas(data)
  
    const novasDatas = {}
    data.forEach(tarefa => {
      if (tarefa.dataConclusao) {
        const dataObj = new Date(tarefa.dataConclusao)
        if (!isNaN(dataObj)) {
          novasDatas[tarefa.id] = dataObj.toISOString().split('T')[0]
        }
      }
    })
    setDatasConclusao(novasDatas)
  }
  const iniciarTarefa = async (id) => {
    try {
      await tarefaService.iniciar(id)
      Swal.fire("Tarefa iniciada!", "Status atualizado para 'Em Progresso'", "success")
      buscarTarefas()
    } catch (error) {
      Swal.fire("Erro", "Erro ao iniciar a tarefa. Tente novamente.", "error")
      console.error(error)
    }
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
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
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
                onChange={(e) => filtrarPorStatus(e.target.value)}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
          </div>
        </div>

        {tarefas.map((tarefa) => (
          <div className="task" key={tarefa.id}>
            <span style={{
              position: 'absolute',
              top: '10px',
              fontWeight: 'bold',
              right: '15px',
              fontSize: '14px',
              color: '#eee'
            }}>
              Criada em: {new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')}
            </span>

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
  <>
    <p style={{ color: 'white', marginTop: '5px', fontWeight: 'bold', fontSize: '12px' }}>
      Concluída em: {new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}
    </p>
  </>
)}

{tarefa.status === 0 && (
  <button
    style={{
      marginTop: '5px',
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '3px 8px',
      fontSize: '12px',
      cursor: 'pointer'
    }}
    onClick={() => iniciarTarefa(tarefa.id)}
  >
    INICIAR
  </button>
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
