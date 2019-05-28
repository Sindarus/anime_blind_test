Vue.component('player-list-component', {
	props: ['players'],
	template: `
		<div>
			<player-component v-for="cur_player in players"
							  v-bind:player="cur_player"
							  v-bind:key="cur_player.username">
			</player-component>
		</div>
	`
})
