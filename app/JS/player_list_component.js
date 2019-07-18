Vue.component('player-list-component', {
	props: ['players', 'dark_mode'],
	template: `
		<div class="player_list_component">
			<player-component v-for="cur_player in players"
							  v-bind:player="cur_player"
							  v-bind:key="cur_player.username"
							  v-bind:dark_mode="dark_mode">
			</player-component>
		</div>
	`
});
