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

			let player = new Player(this.username);

			this.loading_user_animelist = true;
			player.load_user_data()
			.then(e => {
				this.m_game_engine.add_player(player);
				this.loading_user_animelist = false;
			})
			.catch(e => {
				alert("Your animelist could not be retrieved. Please check your username and retry.");
				console.log("Animelist could not be retrieved. Error: ", e);
				this.loading_user_animelist = false;
			});
		}
	}
});
