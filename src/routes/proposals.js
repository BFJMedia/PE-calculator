
import ProposalHome from '@/pages/Proposals/Proposals.vue'
import ProposalMain from '@/pages/Proposals/Main.vue'
import Levels from '@/pages/Proposals/Levels.vue'
import Rooms from '@/pages/Proposals/Rooms.vue'
import Activities from '@/pages/Proposals/Activities.vue'
import Periodicals from '@/pages/Proposals/Periodicals.vue'
import Optional from '@/pages/Proposals/Optional.vue'
import ProposalHeader from '@/pages/Proposals/Header.vue'

import ProposalLayout from '@/layouts/Proposal.vue'

export default [
  {
    path: '/proposals',
    name: 'Proposals',
    component: ProposalHome,
    meta: {
        requiresAuth: true,
        role: ['admin', 'editor'],
        layout: ProposalLayout
    },
    children: [
      {
        name: 'ProposalMain',
        path: '/',
        component: ProposalMain,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },
      },
      {
        name: 'ProposalLevels',
        path: 'levels',
        component: Levels,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
      {
        name: 'ProposalRooms',
        path: 'rooms',
        component: Rooms,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
      {
        name: 'ProposalActivities',
        path: 'activities',
        component: Activities,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
      {
        name: 'ProposaPeriodicals',
        path: 'periodicals',
        component: Periodicals,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
      {
        name: 'ProposalOptional',
        path: 'optional',
        component: Optional,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
      {
        name: 'ProposalHeader',
        path: 'header',
        component: ProposalHeader,
        meta: {
          requiresAuth: true,
          role: ['admin', 'editor'],
          layout: ProposalLayout
        },        
      },
    ]
  }, 
]