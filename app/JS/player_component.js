Vue.component('player-component', {
	props: ['player', 'small', 'dark_mode'],
	template: `
		<span class="player_card"
			  v-bind:class="{small: small, dark: dark_mode}"
			  v-on="$listeners">
			{{ player.username[0] }}
		</span>
	`
});
