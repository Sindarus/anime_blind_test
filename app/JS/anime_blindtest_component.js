let app = new Vue({
    el: '#app_container',
    data: {
        game_engine: (function() {a = new GameEngine(); console.log("game_engine:", a); return a})()
    },
    methods: {
        trigger_blind_tester_component: function() {
            this.game_engine.is_playing = true;
            this.$refs["blindTesterComp"].start_blindtest();
        },
        blindtest_is_ready(){
            return this.game_engine.compute_testable_animes_pool().length > 0;
        },
        get_css_disabled_style: get_css_disabled_style
    },
    template: `
        <div id="app_container">
            <div id="main_window_container" v-show="!game_engine.is_playing">
                <div id="main_window">
                    <div id="left_half">
                        <div class="section" id="players">
                            <h4>Players</h4>
                            <div id="username_form">
                                <player-list-component v-bind:players="game_engine.players"></player-list-component>
                                <player-adder-component v-bind:m_game_engine="game_engine"></player-adder-component>
                            </div>
                            <div id="playerlist">
                            </div>
                        </div>
                        <div class="section" id="options">
                            <h4>Options</h4>
                            <options-component v-on:update:options="game_engine.options = $event"></options-component>
                        </div>
                    </div>
                    <div id="vertical_separator"></div>
                    <div id="right_half">
                        <div class="section" id="testable_animes_section">
                            <h4>List of testable animes</h4>
                            <testable-animes-list-component v-bind:m_game_engine="game_engine"></testable-animes-list-component>
                        </div>
                        <div id="button_container" v-bind:style="get_css_disabled_style(!blindtest_is_ready())">
                            <div class="button" id="blind_test_button" v-on:click="trigger_blind_tester_component()">
                                Blind test me !
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <blind-tester-component ref="blindTesterComp"
                                    v-on:stop-playing="game_engine.is_playing=false"
                                    v-bind:m_game_engine="game_engine">
            </blind-tester-component>
        </div>
    `
});
