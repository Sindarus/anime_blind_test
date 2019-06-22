Vue.component('options-component', {
	data: function() {
		return {
			options: {
				joint_animes: true,
				prevent_looping: true,
				time_till_reveal: MOCK_MODE ? 5 : 20,
				time_till_next_vid: MOCK_MODE ? 5 : 10,
				watch_till_end: false
			}
		}
	},
	mounted(){
		this.$emit('update:options', this.options)
	},
	beforeUpdate(){
		this.$emit('update:options', this.options)
	},
	methods: {
		get_css_disabled_style(is_disabled){
			if(is_disabled){
				return {
					'opacity': 0.3,
					'pointer-events': 'none'
				}
			}
			else {
				return {}
			}
		}
	},
	template: `
		<div class="options_component">
			<table>
				<tr v-on:click="options.joint_animes = !options.joint_animes">
					<td>
						<span v-show="options.joint_animes">Blindtest animes that everyone has seen</span>
						<span v-show="!options.joint_animes">Blindtest animes that one person has seen</span>
					</td>
					<td class="option_control">
						<span v-show="options.joint_animes"><span class="fas fa-2x fa-toggle-on"></span></span>
						<span v-show="!options.joint_animes"><span class="fas fa-2x fa-toggle-off"></span></span>
					</td>
				</tr>
				<tr v-on:click="options.prevent_looping = !options.prevent_looping">
					<td>
						<span v-show="options.prevent_looping">Only blindtest unseen videos</span>
						<span v-show="!options.prevent_looping">Allow blindtesting seen videos</span>
					</td>
					<td class="option_control">
						<span v-show="options.prevent_looping"><span class="fas fa-2x fa-toggle-on"></span></span>
						<span v-show="!options.prevent_looping"><span class="fas fa-2x fa-toggle-off"></span></span>
					</td>
				</tr>
				<tr>
					<td>
						<span>Alloted time for guessing the anime (sec.)</span>
					</td>
					<td class="option_control">
						<input type="number" v-model="options.time_till_reveal">
					</td>
				</tr>
				<tr v-bind:style="get_css_disabled_style(options.watch_till_end)">
					<td>
						<span>Alloted time for watching the answer (sec.)</span>
					</td>
					<td class="option_control">
						<input type="number" v-model="options.time_till_next_vid">
					</td>
				</tr>
				<tr v-on:click="options.watch_till_end = !options.watch_till_end">
					<td>
						<span>Watch videos till the end</span>
					</td>
					<td class="option_control">
						<span v-show="options.watch_till_end"><span class="fas fa-2x fa-toggle-on"></span></span>
						<span v-show="!options.watch_till_end"><span class="fas fa-2x fa-toggle-off"></span></span>
					</td>
				</tr>
			</table>
		</div>
	`
});
