Vue.component('testable-animes-list-component', {
	props: ['m_game_engine'],
	template: `
		<table id="testable_animes_list">
			<tr v-for="players_anime in get_all_players_animes()" class="testable_anime_row">
				<td>
					<div class="player_list">
						<player-component v-for="player in players_anime.players"
										  v-bind:key="player.username"
										  v-bind:player="player"
										  v-bind:small="true">
						</player-component>
					</div>
				</td>
				<td class="anime_name">
					{{ players_anime.anime_name }}
				</td>
			</tr>
		</table>
	`,
	methods: {
		get_all_players_animes: function() {
			// TODO : make "compute_testable_anime_poo" return a ixed video list and use .animes()
			let mm_game_engine = this.m_game_engine;

			all_animes = Object.keys(mm_game_engine.compute_testable_anime_pool())
			players_anime_list = all_animes.map(function(anime){
				return {
					anime_name: anime,
					players: mm_game_engine.players.filter(player => player.has_seen(anime)).reverse()
				}
			})
			return players_anime_list.sort(function(players_anime_1, players_anime_2){
				return players_anime_1.players.length < players_anime_2.players.length
			})
		}
	}
})
