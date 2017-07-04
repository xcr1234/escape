import Vue from 'vue'
import Router from 'vue-router'
import Play from '@/components/Play'
import GameOver from '@/components/GameOver'
import Ending from '@/components/Ending'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Play',
            component: Play
        },
        {
            path: '/gameover',
            name: 'GameOver',
            component: GameOver
        },
        {
            path: '/ending',
            name: 'Ending',
            component: Ending
        }
    ]
})
