import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/books',
      name: 'books-page',
      component: require('@/components/BooksPage').default
    },
    {
      path: '/bookDetail',
      name: 'book-detail',
      component: require('@/components/BookDetail').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
