<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
            <detail-swiper :topImages="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info :param-info="paramInfo" ref="params"/>
            <detail-comment-info :comment-info="commentInfo" ref="comment"/>
            <goods-list :goods="recommendList" ref="recomment"/>
        </scroll>
        <detail-bottom-bar @addToCart="addToCart"/>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import GoodsList from 'components/content/goods/GoodsList'
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'

    import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
    import { debounce } from "common/utils"
    import { backTopMixin } from "common/mixin"
    import { mapActions } from 'vuex'

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,
            Scroll
        },
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommendList: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0
            }
        },
        mixins: [ backTopMixin ],
        created() {
            // 1.保存存入的iid
            this.iid = this.$route.params.iid

            // 2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                console.log(res);
                
                const data = res.result
                // 1.获取顶部的图片轮播数据
                this.topImages = data.itemInfo.topImages

                // 2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

                // 3.创建店铺信息的对象
                this.shop = new Shop(data.shopInfo)

                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo

                // 5.获取参数的信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

                // 6.获取评论信息
                if (data.rate.list) {
                    this.commentInfo = data.rate.list[0]
                }
            }),
            getRecommend().then((res, error) => {
                if (error) return
                this.recommendList = res.data.list
            }),
            
            // 4.给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0)
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recomment.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
            }, 100)
        },
        methods: {
            ...mapActions(['addCart']),
            imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY()
            },
            titleClick(index) {
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
            },
            contentScroll(position) {
                // 1.获取y值
                const positionY = -position.y

                // 2.positionY和主题中的值进行比较
                let length = this.themeTopYs.length
                for (let i = 0; i < length - 1; i++) {
                    if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]))
                    this.currentIndex = i
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            },
            addToCart() {
                // 1.获取购物车需要展示的信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title
                product.desc = this.goods.desc
                product.price = this.goods.nowPrice
                product.iid = this.iid

                // 2.将商品添加到购物车里
                this.addCart(product).then(res => {
                    this.$toast.show(res, 2000)
                })
            }
        }
    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content {
        height: calc(100% - 44px);
    }
</style>