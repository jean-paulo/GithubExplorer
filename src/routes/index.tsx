import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

// Se não tiver o switch ele mostra todas as rotas ao mesmo tempo
// Exact faz uma verificação para que a rota seja exatamente aquela
// o + no final da rota faz com que tudo que vier depois da barra faça parte da rota,
// se vier outra barra ele não entende como outra rota
const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repositories/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
