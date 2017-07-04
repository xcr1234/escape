<template>
    <div>
        <h2>
            <div id="end" style="display: none;margin: 0 auto;line-height: 500px; text-align: center;">{{endText}}<a
                    href="javascript:;" v-on:click="play">返回首页</a></div>
        </h2>
    </div>
</template>
<style>
    @import "./../../static/css/gameover.css";

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
<script>
    export default{
        name: "Ending",
        computed:{
            endText:function () {
                const reborn = this.$route.query.reborn;
                return reborn == 0 ? "The end！复活药用完了，你死了" : "The end！你在临死前用所有复活药（" + reborn + "）救了自己一命。";
            }
        },
        methods:{
            play:function () {
                this.$router.push('/');
            }
        },
        mounted:function () {
            $("#end").fadeIn(5000);
        }
    }
</script>