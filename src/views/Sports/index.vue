<template>
  <div style="padding: 20px">
    <div v-if="mySports.length > 0">
      <h3>My Favourite</h3>
      <el-row :grid="20">
        <el-col
          v-for="(sport, index) in mySports"
          :key="index"
          class="grid-cell"
          :xs="6"
          :sm="6"
          :md="6"
          :lg="4"
          :xl="4"
        >
          <div class="card">
            <img :src="sport.icon" alt="" />
            <p>{{ sport.name }}</p>
            <button
              class="route-btn"
              @click="$router.push('/app/sports/' + sport.decathlonId)"
            >
              Find Places
            </button>
            <div class="icon-btn">
            <el-tooltip
              content="Remove from Favourite"
              placement="bottom"
              effect="dark"
            >
              <el-button
                circle
                type="danger"
                icon="el-icon-delete"
                @click="removeFavourite(sport.id)"
              ></el-button>
            </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div align="center">
      <input
        type="text"
        v-model="query"
        class="search-field"
        placeholder="Search Sport"
        @keyup="filterData"
      />
    </div>
    <el-row :grid="20">
      <el-col
        v-for="(sport, index) in filteredData"
        :key="index"
        class="grid-cell"
        :xs="6"
        :sm="6"
        :md="6"
        :lg="4"
        :xl="4"
      >
        <div class="card">
          <img :src="sport.attributes.icon" alt="" />
          <p>{{ sport.attributes.name }}</p>
          <button
            class="route-btn"
            @click="$router.push('/app/sports/' + sport.id)"
          >
            Find Places
          </button>
          <div class="icon-btn">
          <el-tooltip
            content="Add to Favourite"
            placement="bottom"
            effect="dark"
          >
            <el-button
              circle
              type="success"
              icon="el-icon-circle-plus"
              @click="addToFavourite(sport)"
            ></el-button>
          </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SportIndex',
  data() {
    return {
      query: '',
      sports: [],
      mySports: [],
      filteredData: []
    }
  },
    computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {
    if(!this.user.id){
        this.$router.push('/')
      }
    this.fetchSports()
    this.getMySports()

  },
  methods: {
    fetchSports() {
      this.$store.dispatch('fetchSports')
      .then(
        (response) => {
          this.sports = response.data.data
          this.filteredData = response.data.data
        }
      )
    },
    filterData() {
      if (!this.query) {
        this.filteredData = this.sports
        return
      }
      this.filteredData = this.sports.filter(sport => sport.attributes.name.toLowerCase().includes(this.query.toLowerCase()))
    },
    getMySports() {
      this.$store.dispatch('getMySports', localStorage.getItem('userId'))
        .then(
          (response) => {
            console.log(response.data.data)
            this.mySports = response.data
          }
        )
    },
    addToFavourite(data) {
      const payload = {
        userId: localStorage.getItem('userId'),
        name: data.attributes.name,
        icon: data.attributes.icon,
        sportId: data.id
      }
      this.$store.dispatch('addToFavourite', payload)
        .then(
          (response) => {
            if (response) {
              this.getMySports()
            }
          }
        )
    },
    removeFavourite(id) {
      this.$store.dispatch('removeSport', id)
        .then(
          (response) => {
            if (response) {
              this.getMySports()
            }
          }
        )
    }
  }
}
</script>

<style lang="scss">
.card {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    position: relative;
}
.card:hover {
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.26);
}
.grid-cell {
    padding: 10px
}
.card img {
    height: 80px;
    margin: 0;
}
.card p {
    font-weight: 600;
    font-size: 12px;
}
.search-field {
    width: 50%;
    height: 50px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.16);
    padding: 10px 20px;
    outline: none;
}
.route-btn {
  width: 90%;
  color: #fff;
  height: 30px;
  background-color: rgb(17, 0, 255);
  outline: none;
  border: none;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 12px;
}
.icon-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
