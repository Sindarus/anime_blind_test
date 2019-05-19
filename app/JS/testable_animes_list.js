Vue.component('testable-animes-list-component', {
	props: ['m_game_engine'],
	template: `
		<table id="testable_animes_list">
			<tr v-for="anime in get_all_animes()">
				<td>
					<player-component v-for="player in m_game_engine.players"
									  v-bind:key="player.username"
									  v-if="player.has_seen(anime)"
									  v-bind:player="player"
									  v-bind:small="true">
					</player-component>
				</td>
				<td>
					{{ anime }}
				</td>
			</tr>
		</table>
	`,
	methods: {
		get_all_animes: function() {
			// TODO : make "compute_testable_anime_poo" return a ixed video list and use .animes()
			return Object.keys(this.m_game_engine.compute_testable_anime_pool())
		}
	}
})
