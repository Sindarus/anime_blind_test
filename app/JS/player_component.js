Vue.component('player-component', {
    props: ['player', 'small', 'dark_mode'],
    template: `
        <span class="player_card"
              v-bind:class="{small: small, dark: dark_mode}"
              v-on="$listeners">
            <span v-if="player.profile_picture_url === undefined">
                {{ player.username[0] }}
            </span>
            <img v-if="player.profile_picture_url !== undefined" v-bind:src="player.profile_picture_url"/>
        </span>
    `
});
