<template>
    <div>
        <navbar />
        <router-view></router-view>
    </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
    name: 'SimpleLayout',
    components: {
        Navbar
    }
}
</script>