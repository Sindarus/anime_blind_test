Vue.component('player-adder-component', {
	data: function() {
		return {
			username: "",
			loading_user_animelist: false
		}
	},
	props: ['m_game_engine'],
	template: `
		<div>
			<form id="username_form" v-on:submit="process_form">
				<input type="text" id="mal_nickname" name="mal_nickname" placeholder="MAL username" v-model="username">
				<button type="submit" class="button">Load my anime list !</button>
			</form>
			<p class="loading_msg" v-if="loading_user_animelist">Loading...</p>
		</div>
	`,
	methods: {
		process_form: function(e) {
			e.preventDefault();

			let player = new Player(this.username);

			this.loading_user_animelist = true
			res = player.load_user_data() // TODO: promisify this call
			this.loading_user_animelist = false

			if (res != -1){
				this.$emit('add_player', player)
			}
			else {
				alert("Your animelist could not be retrieved. Please check your username and retry.");
			}
		}
	}
})
