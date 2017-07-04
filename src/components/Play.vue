<template>
    <div class="main">
        <div v-bind:class="game.question ? 'frameQuestion' : 'frameEvent'">{{ game.title }} <img src="./../../static/img/audio.png" style="cursor: pointer;" onclick="document.getElementById('audio1').play()" /></div>
        <div class="optionQues" v-if="game.question">
            <div class="item" v-for="(answer,index) in game.answer">
                <input type="radio" name="options" v-bind:id="'options' + index" class="option-input radio" v-bind:value="index" v-model="select" />
                <label v-bind:for="'options' + index">{{answer}}</label>
            </div>
        </div>
        <div class="pull-right">
            <a class="btn btn-success" href="javascript:;" style="text-decoration: none;" v-on:click="continueGame">继续</a><br />
            复活药数量：{{reborn}}<br/><br/>
            <a href="javascript:;" v-on:click="againGame">从头再来</a>
        </div>
        <audio style="display:none" v-bind:src="audioSrc" autoplay="autoplay" id="audio1"></audio>
    </div>
</template>

<style>
    @import "./../../static/bealert/BeAlert.css";
    @import "./../../static/css/game.css";
    @import "./../../static/css/buttons.css";
    @import "./../../static/css/radio.css";
</style>

<script>
    import "./../../static/bealert/BeAlert";
    import data from './../game_data';
    export default{
        name:"Play",
        data:function () {
          return {
              reborn : 0,
              level : 0,
              select:null,
              errorMsg:null,
              sound:null
          }
        },
        methods:{
            continueGame:function () {
                if(this.game.question && this.select == null){
                    alert("这是一个选择事件，你需要选择一项才能继续游戏!", {type: 'success', confirmButtonText: '确定'});
                    return;
                }
                if(this.game.question){
                    if(this.select == this.game.correct){ //答对了
                        this.nextLevel();
                    }else if(this.reborn > 0){  //答错了，有复活药
                        this.minReborn();
                        //消耗复活药，继续游戏
                        this.errorMsg = this.game.msgs[this.select];
                    }else{      //答错了，木有复活药
                        this.reset();
                        this.$router.push('/gameover');
                    }
                }else{
                    this.nextLevel();
                }
            },
            nextLevel:function () {
                if(this.errorMsg){
                    this.errorMsg = null;
                }
                this.select = null;
                if(this.game.reborn > 0){
                    this.addReborn(this.game.reborn);
                }
                this.level++ ;
                window.localStorage["escape_level"] = this.level;
                if(this.game.title == "###END###"){
                    this.$router.push({
                        path:"/ending",
                        query:{
                            reborn : this.reborn
                        }
                    });
                    this.reset();
                }
            },
            addReborn:function (val) {
                this.reborn += val;
                window.localStorage["escape_reborn"] = this.reborn;
            },
            minReborn:function () {
                this.reborn--;
                window.localStorage["escape_reborn"] = this.reborn;
            },
            againGame:function () {
                const that = this;
                confirm("是否要从头开始？","所有游戏进度都会丢失.",function (isConfirm) {
                    if(isConfirm){
                        that.reset();
                    }
                },{confirmButtonText: '是!', cancelButtonText: '否!', width: 400});
            },
            reset:function () {
                this.level = 0;
                this.reborn = 0;
                window.localStorage.removeItem("escape_level");
                window.localStorage.removeItem("escape_reborn");
            },
        },
        mounted:function () {
            this.level = window.localStorage["escape_level"] ? window.localStorage["escape_level"] : 0;
            this.reborn = window.localStorage["escape_reborn"] ? window.localStorage["escape_reborn"] : 0;
        },
        computed:{
            game:function () {
                if(this.errorMsg){
                    return {
                        reborn:0,
                        question:false,
                        title:this.errorMsg,
                        answer:[]
                    }
                }
                return data[this.level];
            },
            audioSrc:function () {
                return 'http://118.89.174.235:8080/speech/speech?uid=' + window.uid + '&text=' + this.game.title;
            }
        }
    }
</script>