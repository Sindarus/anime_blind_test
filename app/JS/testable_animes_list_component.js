Vue.component('testable-animes-list-component', {
	props: ['m_game_engine'],
	template: `
		<table id="testable_animes_list">
			<tr v-for="anime in get_all_animes_list()"
				class="testable_anime_row"
				v-bind:class="{disabled: !anime.selected, enabled: anime.selected}">
				<td v-for="player in m_game_engine.players" v-bind:key="player.username" class="player_td">
					<div v-if="player.has_seen(anime.anime_name)">
						<player-component v-bind:player="player"
										  v-bind:small="true"
										  v-bind:dark_mode="false">
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
				<td class="action_td" v-on:click="fire_toggle_anime_selection(anime)">
					<div class="action_icon">
						<div v-show="anime.selected">
							<div>-</div>
							<div class="spacer"></div>
						</div>
						<div v-show="!anime.selected">+</div>
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
		fire_toggle_anime_selection: function(anime) {
			if(anime.selected === true){
				this.$emit("toggle-anime-selection", {"selected": false, "anime_name": anime.anime_name});
			}
			else if(anime.selected === false) {
				this.$emit("toggle-anime-selection", {"selected": true, "anime_name": anime.anime_name});
			}
			else throw "anime.selected should be either true or false";
		}
	}
});
