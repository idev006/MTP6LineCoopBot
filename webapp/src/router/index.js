/**
 * Vue Router Configuration
 * 
 * Routes สำหรับ Guest, Staff, Admin
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

// Guest Views
import HomeView from '@/views/guest/HomeView.vue'
import LoginView from '@/views/guest/LoginView.vue'

// App Views
import DashboardView from '@/views/app/DashboardView.vue'
import MemberListView from '@/views/app/MemberListView.vue'
import MemberDetailView from '@/views/app/MemberDetailView.vue'

// Admin Views
import StaffManageView from '@/views/app/admin/StaffManageView.vue'
import RoleManageView from '@/views/app/admin/RoleManageView.vue'
import SettingsView from '@/views/app/admin/SettingsView.vue'
import AuditLogView from '@/views/app/admin/AuditLogView.vue'

const routes = [
  // Guest routes
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { title: 'Home' }
      },
      {
        path: 'login',
        name: 'login',
        component: LoginView,
        meta: { title: 'Login' }
      }
    ]
  },

  // App routes (Staff/Admin)
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'members',
        name: 'members',
        component: MemberListView,
        meta: { 
          title: 'Members',
          roles: ['staff', 'admin', 'manager']
        }
      },
      {
        path: 'members/:code',
        name: 'member-detail',
        component: MemberDetailView,
        meta: { 
          title: 'Member Detail',
          roles: ['staff', 'admin', 'manager']
        }
      },

      // Admin only routes
      {
        path: 'admin',
        meta: { requiresAdmin: true },
        children: [
          {
            path: 'staff',
            name: 'admin-staff',
            component: StaffManageView,
            meta: { 
              title: 'Staff Management',
              roles: ['admin']
            }
          },
          {
            path: 'roles',
            name: 'admin-roles',
            component: RoleManageView,
            meta: { 
              title: 'Role Management',
              roles: ['admin']
            }
          },
          {
            path: 'settings',
            name: 'admin-settings',
            component: SettingsView,
            meta: { 
              title: 'Settings',
              roles: ['admin']
            }
          },
          {
            path: 'audit',
            name: 'admin-audit',
            component: AuditLogView,
            meta: { 
              title: 'Audit Log',
              roles: ['admin']
            }
          }
        ]
      }
    ]
  },

  // Catch all - redirect to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' })
  }
  
  // Check if route requires admin
  if (to.meta.requiresAdmin && !auth.hasRole('admin')) {
    return next({ name: 'dashboard' })
  }
  
  // Check roles
  if (to.meta.roles && !to.meta.roles.some(r => auth.hasRole(r))) {
    return next({ name: 'dashboard' })
  }
  
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - MTP6LineCoopBot` : 'MTP6LineCoopBot'
  
  next()
})

export default router
