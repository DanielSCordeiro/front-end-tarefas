import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Header } from "../componets/header"
import { Footer } from "../componets/footer"


// LISTAR TAREFAS
export function Home() {
  const navigate = useNavigate()
  const [ load, setLoad ] = useState(true)
  const [ filtro, setFiltro ] = useState('all')
  const [ lista, setLista ] = useState([])

  // faz a leitura das tarefas no banco de dados MongoDB
  async function consultarTarefas() {

    try {
      
      // caso não tenha filtros, irá listar todas as tarefas
      // do contrário, irá buscar pelas tarefas correspondentes
      let url = 'http://localhost:3001/tarefas'
      if (filtro !== 'all') {
        url += `/${filtro}`
      }

      let res = await fetch(url, {method: 'GET'})
      let json = await res.json()
      setLista(json)
      setLoad(false)

    } catch (error) {
      console.error(error)
    }
  }


  // DELETAR TAREFA
  async function deletarTarefa(id) {
    // aqui deveria ser colocado uma opção para o usuário
    // confirmar se deseja realmente deletar a tarefa
    if (id) {

      let res = await fetch(`http://localhost:3001/tarefas/${id}`, {method: 'DELETE'})
      let json = await res.json()

      if (json.info) {
        alert(json.info)
  
        if (json.info === 'Tarefa removida com sucesso.') {
          consultarTarefas()
        }
  
      } else {
        alert('Não foi possível inserir uma tarefa, por favor, tente novamente mais tarde. Caso esta mensagem persista, entre em contato com o suporte técnico.')
      }

    }
  }


  // EDITAR TAREFA
  function editarTarefa(item) {
    // aqui normalmente utilizo um ContextAPI ou
    // crio outra rota para filtrar pelo ID e carregar
    // os dados na página 'editar', porém como estou fazendo
    // com tempo curto, vou improvisar com localStorage
    localStorage.setItem('editar', JSON.stringify(item))
    navigate(`/editar/${item._id}`)
  }


  useEffect(() => {
    consultarTarefas()
  }, [filtro])

  return (
    <section className="container">
      <Header title='TAREFAS DIÁRIAS' subTitle='Lista de trabalhos diários' />
      <div className="conteudo">

        {load && <p>Aguarde...</p>}

        {!load && lista.length === 0 && <p>Nenhuma tarefa localizada.</p>}

        {!load && lista.length !== 0 && (
          lista.map(item => <div key={item._id} className="lista">
            <p>{item.text}</p>
            <nav>
              <li onClick={() => deletarTarefa(item._id)}>Deletar</li>
              <li onClick={() => editarTarefa(item)}>Editar</li>
            </nav>
          </div>)
        )}

        {!load && (
          <>
            <div className="botoes">
              <p>Filtrar por:</p>
              <li 
                className={filtro === 'all' ? 'ativo' : 'link'}
                onClick={() => setFiltro('all')}
              >Todos</li>
              <li 
                className={filtro === 'pending' ? 'ativo' : 'link'}
                onClick={() => setFiltro('pending')}
              >Pendente</li>
              <li 
                className={filtro === 'progress' ? 'ativo' : 'link'}
                onClick={() => setFiltro('progress')}
              >Em Andamento</li>
              <li 
                className={filtro === 'testing' ? 'ativo' : 'link'}
                onClick={() => setFiltro('testing')}
              >Em Teste</li>
              <li 
                className={filtro === 'done' ? 'ativo' : 'link'}
                onClick={() => setFiltro('done')}
              >Concluido</li>
            </div>
            <div className="botoes">
              <a onClick={() => navigate('/inserir')}>Criar Nova Tarefa</a>
            </div>
          </>
        )}

      </div>
      <Footer />
    </section>
  )
}