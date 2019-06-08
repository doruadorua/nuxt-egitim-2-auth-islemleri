<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
        <a class="navbar-brand" href="#">Auth İşlemleri</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <nuxt-link tag="li" to="/" active-class="active" exact class="nav-item">
                    <a class="nav-link" href="">Anasayfa</a>
                </nuxt-link>
                <nuxt-link tag="li" to="/about" active-class="active" exact class="nav-item">
                    <a class="nav-link" href="">Hakkımda</a>
                </nuxt-link>
            </ul>
            <ul v-if="isAuth" class="navbar-nav my-2 my-lg-0">
                <li class="nav-item">
                    <a @click.prevent="logout" href="#" class="nav-link">Çıkış Yap</a>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
export default {
    methods: {
        logout(){
            this.$store.dispatch('logout')
            this.$router.push('/auth')
        }
    },
    computed:{
        isAuth(){
            return this.$store.getters.isAuth
        }
    }
}
</script>

