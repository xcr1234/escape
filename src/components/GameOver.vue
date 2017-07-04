<template>
    <div>
        <div class="main">
            <a  href="javascript:;" v-on:click="play"><img src="./../../static/img/gameover.jpg" id="img"  alt="gameover"/></a>
        </div>
        <div style="text-align: center">复活药用完了，继续努力吧↖(^ω^)↗</div>
        <audio src="./../../static/img/gameover.mp3" autoplay="autoplay"></audio>
    </div>
</template>

<style>
    @import "./../../static/css/gameover.css";
    #img{
        width: 600px;
        height: 500px;
        display: none;
    }
    .main{
        width: 600px;
        height: 500px;
    }
</style>

<script>
    export default{
        name: "GameOver",
        methods: {
            play: function () {
                this.$router.push('/');
            },
        },
        mounted:function () {
            $("img").fadeIn(9000);
        }
    }





</script>