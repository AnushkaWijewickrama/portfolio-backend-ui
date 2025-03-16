import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './util/auth.guard';
import { LoginGuard } from './util/loginguard.guard';
import { AllProjectsComponent } from './components/projects/project-list/all-projects.component';
import { CreateProjectComponent } from './components/projects/create-project/create-project.component';
import { AllStackComponent } from './components/stack/stack-list/all-stack.component';
import { CreateStackComponent } from './components/stack/create-stack/create-stack.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: '/projects',
        pathMatch: 'full'
    },
    {
        path: 'addproject',
        component: CreateProjectComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'editproject/:id',
        component: CreateProjectComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: AuthComponent,
        canActivate: [LoginGuard]

    },
    {
        path: 'projects',
        component: AllProjectsComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'stack',
        component: AllStackComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'addStack',
        component: CreateStackComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'editStack/:id',
        component: CreateStackComponent,
        canActivate: [AuthGuard]
    },

];
