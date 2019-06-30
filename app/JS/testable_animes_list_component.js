Vue.component('testable-animes-list-component', {
	props: ['m_game_engine'],
	template: `
		<table id="testable_animes_list">
			<tr v-for="anime in get_all_animes_list()"
				class="testable_anime_row"
				v-bind:class="{disabled: !anime.selected}">
				<td class="player_list">
					<div class="player_list">
						<player-component v-for="player in anime.players"
										  v-bind:key="player.username"
										  v-bind:player="player"
										  v-bind:small="true">
						</player-component>
					</div>
				</td>
				<td class="anime_name_td">
					<div class="anime_name">
						<div>
							{{ anime.anime_name }}
						</div>
						<div class="anime_name_spacer">
						</div>
					</div>
				</td>
			</tr>
			<span v-if="get_all_animes_list().length === 0">No anime to blindtest. Please add some.</span>
		</table>
	`,
	methods: {
		get_all_animes_list: function() {
			const players_anime_list = this.m_game_engine.compute_all_animes_list();
			return players_anime_list.sort(function (players_anime_1, players_anime_2) {
				return players_anime_1.players.length < players_anime_2.players.length;
			});
		},
	}
});
