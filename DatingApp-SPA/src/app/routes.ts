import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './Members/MemberList/MemberList.component';
import { MessagesComponent } from './Messages/Messages.component';
import { ListsComponent } from './Lists/Lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './Members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './Members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { UnsavedChanges } from './_guards/unsaved-changes.guard';

export const appRoues: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        canActivate: [AuthGuard],
        resolve: { users: MemberListResolver },
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        canActivate: [AuthGuard],
        resolve: { user: MemberDetailResolver },
      },
      {
        path:'member/edit',
        component:MemberEditComponent,
        resolve:{user:MemberEditResolver},
        canDeactivate:[UnsavedChanges]
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
