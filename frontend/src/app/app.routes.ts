import { Routes } from '@angular/router';
import { ApiTest } from './pages/api-test/api-test';
import { CrudTest } from './pages/crud-test/crud-test';
import { SimulationTest } from './pages/simulation-test/simulation-test';

export const routes: Routes = [
  { path: '', redirectTo: 'test-api', pathMatch: 'full' },
  { path: 'test-api', component: ApiTest },
  { path: 'test-crud', component: CrudTest },
  { path: 'test-simulation', component: SimulationTest },
  { path: '**', redirectTo: '' },
];
