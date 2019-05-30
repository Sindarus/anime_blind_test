Vue.component('testable-animes-list-component', {
	props: ['m_game_engine'],
	template: `
		<table id="testable_animes_list">
			<tr v-for="players_anime in get_all_players_animes()" class="testable_anime_row">
				<td class="player_list">
					<div class="player_list">
						<player-component v-for="player in players_anime.players"
										  v-bind:key="player.username"
										  v-bind:player="player"
										  v-bind:small="true">
						</player-component>
					</div>
				</td>
				<td class="anime_name_td">
					<div class="anime_name">
						<div>
							{{ players_anime.anime_name }}
						</div>
						<div class="anime_name_spacer">
						</div>
					</div>
				</td>
			</tr>
		</table>
	`,
	methods: {
		get_all_players_animes: function() {
			let m_game_engine = this.m_game_engine;

			all_animes = m_game_engine.compute_testable_animes_pool();
			players_anime_list = all_animes.map(function(anime){
				return {
					anime_name: anime,
					players: m_game_engine.players
					.filter(player => player.has_seen(anime))
					.sort(function(player_1, player_2){
						return player_1.testable_animes.length > player_2.testable_animes.length
					})
				};
			});
			return players_anime_list.sort(function(players_anime_1, players_anime_2){
				return players_anime_1.players.length < players_anime_2.players.length;
			});
		}
	}
});
