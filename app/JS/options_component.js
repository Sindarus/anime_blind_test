Vue.component('options-component', {
	props: ['options'],
	template: `
		<div class="options_component">
			<table>
				<tr>
					<td>
						<span v-show="options.joint_animes">Blindtest animes that everyone has seen</span>
						<span v-show="!options.joint_animes">Blindtest animes that one person has seen</span>
					</td>
					<td class="option_control" v-on:click="options.joint_animes = !options.joint_animes">
						<span v-show="options.joint_animes"><i class="fas fa-2x fa-toggle-on"></i></span>
						<span v-show="!options.joint_animes"><i class="fas fa-2x fa-toggle-off"></i></span>
					</td>
				</tr>
				<tr>
					<td>
						<span v-show="options.prevent_looping">Only blindtest unseen videos</span>
						<span v-show="!options.prevent_looping">Allow blindtesting seen videos</span>
					</td>
					<td class="option_control" v-on:click="options.prevent_looping = !options.prevent_looping">
						<span v-show="options.prevent_looping"><i class="fas fa-2x fa-toggle-on"></i></span>
						<span v-show="!options.prevent_looping"><i class="fas fa-2x fa-toggle-off"></i></span>
					</td>
				</tr>
			</table>
		</div>
	`
});
