<template>
  <div>
    <div class="map-container">
        <el-row :grid="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                <gmap-map
                :center="center"
                :zoom="10"
                style="width:100%;  height: 92vh">
                <gmap-marker
                    :key="index"
                    v-for="(gmp, index) in locations"
                    :position="gmp"
                    @click="center=gmp"
                ></gmap-marker>
                </gmap-map>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
              <div align="center">
                <h2>Places</h2>
              </div>
                <div v-if="places.data" class="places-scroll-con">
                    <div
                        v-for="(place, index) in places.data.features"
                        :key="'places-' + index"
                        class="detail-con"
                    >
                        <p class="heading">{{ place.properties.name }}</p>
                        <p>{{ place.contact_details.phone }}</p>
                        <p>{{ place.address_components.address }}</p>
                    </div>
                </div>
                <div align="center" v-else>
                  <p>No places found!</p>
                </div>
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlacesIndex',
  data() {
    return {
      places: [],
      center: {
        lat: '',
        lng: ''
      },
      locations: []
    }
  },
  beforeCreate() {
  },
  created() {
  },
  mounted() {
    this.geolocate()
    setTimeout(() => {
        this.getPlacesAuto()
    }, 1000)
  },
  methods: {
    geolocate() {
      let center = {}
      let self = this
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    },
    getPlacesAuto() {
      const payload = {
        sportId: this.$route.params.id,
        lat: this.center.lat,
        lng: this.center.lng
      }
      this.$store.dispatch('fetchPlaces', payload)
        .then(
          (response) => {
              const res = response.data.data
            this.places = res
            let locations = []
            res.data.features.map(place => {
                locations.push({
                    lat: place.geometry.coordinates[0],
                    lng: place.geometry.coordinates[1],
                    label: place.properties.name
                })
            })
            this.locations = locations
          }
        )
    }
  }
}
</script>

<style lang="scss">
.detail-con {
    width: 100%;
    padding: 10px 20px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
}
.detail-con:hover {
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.26);
}
.detail-con p {
    margin: 0;
}
.places-scroll-con {
  overflow-y: scroll;
}
</style>