Vue.component('player-component', {
	props: ['player', 'small'],
	template: `<span class="player_card" :class="this.small ? 'small' : ''">{{ player.username[0] }}</span>`,
	methods: {
	}
})
