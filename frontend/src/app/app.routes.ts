import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page/home-page.component').then(c => c.HomePageComponent)
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./admin-login/admin-login.component').then(c => c.AdminLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
        canActivate: [authGuard, adminGuard]
      },
      {
        path: 'contacts',
        loadComponent: () => import('./view-contacts/view-contacts.component').then(c => c.ViewContactsComponent),
        canActivate: [authGuard, adminGuard]
      }
    ]
  },
  {
    path: 'posts',
    children: [
      {
        path: '',
        loadComponent: () => import('./posts-page/posts-page.component').then(c => c.PostsPageComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./create-post/create-post.component').then(c => c.CreatePostComponent),
        canActivate: [authGuard, adminGuard]
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./edit-post/edit-post.component').then(c => c.EditPostComponent),
        canActivate: [authGuard, adminGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./post-detail/post-detail.component').then(c => c.PostDetailComponent)
      }
    ]
  }
];