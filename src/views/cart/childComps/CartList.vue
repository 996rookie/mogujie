<template>
    <div class="cart-list">
        <scroll class="content">
            <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info="item" ref="scroll"/>
        </scroll>
    </div>
</template>

<script>
    import Scroll from 'components/common/scroll/Scroll'
    import CartListItem from './CartListItem'

    import { mapGetters } from 'vuex'

    export default {
        name: "CartList",
        components: {
            Scroll,
            CartListItem
        },
        computed:{
            ...mapGetters(['cartList'])
        },
        methods: {
            activated() {
                this.$refs.scroll.refresh()
            }
        }
    }
</script>

<style scoped>
    .cart-list {
        height: calc(100% - 44px -49px);
    }
    .content {
        height: 100vh;
        overflow: hidden;
    }
</style>