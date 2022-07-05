import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Header } from "../componets/header"
import { Footer } from "../componets/footer"

export function Inserir() {
  const navigate = useNavigate()
  const [ descricao, setDescricao ] = useState('')

  async function novaTarefa() {

    if (!descricao) {
      alert('Informe a decrição para a nova tarefa.')
      return
    }

    let body = {
      "text": descricao,
      "status": "pending"
    }

    const res = await fetch(
      'http://localhost:3001/tarefas',
      {
        method: 'POST',
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

      if (json.info === 'Tarefa criada com sucesso.') {
        navigate('/')
      }

    } else {
      alert('Não foi possível inserir uma tarefa, por favor, tente novamente mais tarde. Caso esta mensagem persista, entre em contato com o suporte técnico.')
    }

  }

  return (
    <section className="container">
      <Header title='NOVA TAREFA' subTitle='Infome uma descrição para a tarefa e clique em inserir.' />
      <div className="conteudo">

        <input
          className='boxInput'
          type='text'
          onChange={t => setDescricao(t.target.value)}
          maxLength='100'
          placeholder='Descrição da tarefa'
          inputMode='text'
          autoComplete='off'
          value={descricao}
        />

        <div className="botoes">
          <p>A tarefa terá o status de <em>pendente</em>. Para alterar, edite esta tarefa, alterando o status.</p>
        </div>

        <div className="botoes">
          <a onClick={() => navigate('/')}>CANCELAR</a>
          <a onClick={novaTarefa}>INSERIR</a>
        </div>
      </div>
      <Footer />
    </section>
  )
}