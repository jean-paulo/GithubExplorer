import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Title, Form, Repositories, Error,
} from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState('');
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  // Sempre que tiver uma mudança na variavel repositories ele dispara o useEffect
  useEffect(() => {
    // Para não conflitar com outras aplicações que usam o mesmo endereço,
    // amos um nome pra informação que vai ser armazenada no LocalStorage
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    // Adição de um novo repositório: Consumir API do Github e Salvar o novo repositório no estado.
    event.preventDefault();

    if (!user) {
      setInputError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<Repository[]>(`users/${user}/repos`);
      const currentReposMap = new Map(repositories.map(repo => [repo.full_name, repo]));
      const uniqueRepositories = response.data.filter(
        repo => !currentReposMap.has(repo.full_name)
      );

      setRepositories([...repositories, ...uniqueRepositories]);

      // Limpa o input e o erro
      setUser('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  useEffect(() => {
    console.log("repositories", repositories);
  }, [repositories])

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github.</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>

        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Digite o nome do usuário"
        />
        <button type="submit">
          Pesquisar
        </button>
      </Form>

      { inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
