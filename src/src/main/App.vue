<script>
import store from '@/common/store';

export default {
    name: 'App',

    data() {
        return {
            isFp: true,
            isBlur: false
        };
    },

    computed: {},

    created() {
        store.initGlobalState();
        setInterval(() => {
            this.isFp = !this.isFp;
        }, 5000)
    },

    watch: {
        isFp() {
            this.isBlur = true;
        }
    },

    methods: {
        onAnimationend() {
            this.isBlur = false;
        }
    }
};
</script>

<template>

    <div class="app__container">
        <transition name="fade">
            <PageFp v-if="isFp"/>
            <PagePosterix v-else/>
        </transition>
        <div class="app__wrapper"
             :class="{'app__wrapper--anim': isBlur}"
             @animationend="onAnimationend()"></div>
    </div>

</template>

<style>
@import '../common/style/reset.css';
@import '../common/style/fonts.css';
@import '../common/style/transition.css';
@import '../common/style/app.css';
</style>
