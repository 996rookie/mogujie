import BackTop from 'components/content/backTop/BackTop'
export const backTopMixin = {
    data() {
        return {
            isShowBackTop: false,
            isTabFixed: false,
            tabOffsetTop: 0
        }
    },
    components: {
        BackTop
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0)
            console.log('-- -- - ');

        },
        contentScroll(position) {
            // 1.判断BackTop是否显示
            this.isShowBackTop = (-position.y) > 1000

            // 2.决定tabControl是否吸顶(position: fixed)
            this.isTabFixed = (-position.y) > this.tabOffsetTop
        },
    }
}