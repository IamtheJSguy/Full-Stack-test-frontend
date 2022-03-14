<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in constantRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { constantRoutes } from '@/router'
// import UserForm from '@/components/AddUsers/form'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem,
    Logo
    // 'user-form': UserForm
  },
  data() {
    return {
      constantRoutes: constantRoutes
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    ...mapState({
      user: state => state.user
    }),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    console.log(this.constantRoutes)
  }
}
</script>

<style lang="scss">
.el-scrollbar {
  height: unset !important;
}
.li-button {
  height: 50px;
  font-family: Helvetica;
  font-size: 14px;
  width: 100%;
  border: none;
  text-align: left;
  margin: 0 !important;
  color: #303133;
  font-weight: 500;
}
</style>
