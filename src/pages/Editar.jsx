import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { Header } from "../componets/header"
import { Footer } from "../componets/footer"

export function Editar() {
  const navigate = useNavigate()
  const [ load, setLoad ] = useState(true)
  const [ id, setID ] = useState('')
  const [ descricao, setDescricao ] = useState('')
  const [ tarefaStatus, setTarefaStatus ] = useState('')

  // atualizar a tarefa
  async function salvarEdicao() {

    if (!descricao) {
      alert('Informe a decrição para a nova tarefa.')
      return
    }

    let body = {
      "text": descricao,
      "status": tarefaStatus
    }

    const res = await fetch(
      `http://localhost:3001/tarefas/${id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    )

    let json = await res.json()
    if (json.info) {
      alert(json.info)

      if (json.info === 'Tarefa atualizada com sucesso.') {
        navigate('/')
      }

    } else {
      alert('Não foi possível inserir uma tarefa, por favor, tente novamente mais tarde. Caso esta mensagem persista, entre em contato com o suporte técnico.')
    }

  }

  async function carregarDados() {
    // carregar as informações anteriores da tarefa
    let res = localStorage.getItem('editar')
    let json = JSON.parse(res)
    if (json) {

      setID(json._id)
      setDescricao(json.text)
      setTarefaStatus(json.status)
      setLoad(false)

    } else {
      alert('Falha ao carregar os dados desta tarefa.')
      navigate('/')
    }
  }


  useEffect(() => {
    carregarDados()
  }, [])


  return (
    <section className="container">
      <Header title='EDITAR TAREFA' subTitle='Você pode alterar a descrição ou o status desta tarefa.' />
      <div className="conteudo">

        {load && <p>Aguarde...</p>}

        {!load && (
          <>
            <input
              className='boxInput'
              type='text'
              onChange={t => setDescricao(t.target.value)}
              maxLength='100'
              placeholder='Informe a descrição da tarefa'
              inputMode='text'
              autoComplete='off'
              value={descricao}
            />

            <div className="botoes">

                {/*
                  Aqui poderia não deixar voltar para um status anterior.
                  Como por exemplo:
                    - embalar o produto
                    - enviar o produto
                    - entrega concluida
                  caso o produto já tenha sido enviado,
                  não poderá mais voltar ao status de 'embalar o produto'
                */}

                <p>Alterar Status:</p>
                <li 
                  className={tarefaStatus === 'pending' ? 'ativo' : 'link'}
                  onClick={() => setTarefaStatus('pending')}
                >Pendente</li>
                <li 
                  className={tarefaStatus === 'progress' ? 'ativo' : 'link'}
                  onClick={() => setTarefaStatus('progress')}
                >Em Andamento</li>
                <li 
                  className={tarefaStatus === 'testing' ? 'ativo' : 'link'}
                  onClick={() => setTarefaStatus('testing')}
                >Em Teste</li>
                <li 
                  className={tarefaStatus === 'done' ? 'ativo' : 'link'}
                  onClick={() => setTarefaStatus('done')}
                >Concluido</li>
            </div>

            <div className="botoes">
              <a onClick={() => navigate('/')}>CANCELAR</a>
              <a onClick={salvarEdicao}>SALVAR</a>
            </div>
          </>
        )}

      </div>
      <Footer />
    </section>
  )
}