Vue.component('player-adder-component', {
    data: function() {
        return {
            username: "",
            loading_user_animelist: false,
            validation_errors: []
        }
    },
    props: ['m_game_engine'],
    template: `
        <div class="player_adder_component">
            <form id="username_form" v-on:submit="process_form">
                <input type="text" id="mal_nickname" name="mal_nickname" placeholder="MAL username" v-model="username">
                <button type="submit" class="button"
                        v-bind:style="get_css_disabled_style(trim_whitespaces(this.username) === '')">
                    Load my anime list !
                </button>
            </form>
            <div v-if="validation_errors.length !== 0" v-for="error in validation_errors" class="valdation_error">
                • {{ error }}
            </div>
            <p class="loading_msg" v-if="loading_user_animelist">
                Loading...
                <span>
                    <i class="fas fa-sync fa-spin"></i>
                </span>
            </p>
        </div>
    `,
    methods: {
        process_form: function(e) {
            e.preventDefault();

            this.username = trim_whitespaces(this.username);

            this.validation_errors = this.validate_form();
            if(this.validation_errors.length !== 0) {
                return
            }

            let player = new Player(this.username);
            this.loading_user_animelist = true;
            player.load_user_data()
            .then(e => {
                this.m_game_engine.add_player(player);
                this.loading_user_animelist = false;
                this.username = '';
            })
            .catch(e => {
                alert("Your animelist could not be retrieved. Please check your username and retry.");
                this.loading_user_animelist = false;
            });
        },
        validate_form() {
            let validation_errors = [];
            if(this.username.search(/\s/) !== -1){
                validation_errors.push("MyAnimeList usernames may not contain any whitespace.")
            }
            if(this.username === ''){
                validation_errors.push("Username may not be empty.")
            }
            if(this.m_game_engine.players.find(p => p.username === this.username) !== undefined){
                validation_errors.push(`You have already loaded ${this.username}'s animelist.`)
            }
            return validation_errors
        },
        get_css_disabled_style: get_css_disabled_style,
        trim_whitespaces: trim_whitespaces
    }
});
