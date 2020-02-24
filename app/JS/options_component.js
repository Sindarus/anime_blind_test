Vue.component('options-component', {
    data: function() {
        return {
            options: {
                joint_animes: true,
                time_till_reveal: MOCK_MODE ? 5 : 20,
                time_till_next_vid: MOCK_MODE ? 5 : 10,
                watch_till_end: false,
                show_who_has_seen: false
            },
            MUSIC_FADING_TIME_S: MUSIC_FADING_TIME_S
        }
    },
    mounted(){
        this.$emit('update:options', this.options)
    },
    beforeUpdate(){
        this.$emit('update:options', this.options)
    },
    methods: {
        get_css_disabled_style: get_css_disabled_style,
        toggle_joint_animes: function() {
            this.options.joint_animes = !this.options.joint_animes;
            this.$emit('anime-selection-method-changed')
        }
    },
    template: `
        <div class="options_component">
            <table>
                <tr v-on:click="toggle_joint_animes()">
                    <td>
                        <span>Only blindtest animes that everyone has seen</span>
                    </td>
                    <td class="option_control">
                        <span v-show="options.joint_animes"><span class="fas fa-2x fa-toggle-on"></span></span>
                        <span v-show="!options.joint_animes"><span class="fas fa-2x fa-toggle-off"></span></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Alloted time for guessing the anime (sec.)</span>
                    </td>
                    <td class="option_control">
                        <input type="number" min="0" v-model="options.time_till_reveal">
                    </td>
                </tr>
                <tr v-bind:style="get_css_disabled_style(options.watch_till_end)">
                    <td>
                        <span>Time for watching the videos after they are revealed (sec.)</span>
                    </td>
                    <td class="option_control">
                        <input type="number" v-bind:min="MUSIC_FADING_TIME_S" v-model="options.time_till_next_vid">
                    </td>
                </tr>
                <tr v-on:click="options.watch_till_end = !options.watch_till_end">
                    <td>
                        <span>Watch videos till the end after they are revealed</span>
                    </td>
                    <td class="option_control">
                        <span v-show="options.watch_till_end"><span class="fas fa-2x fa-toggle-on"></span></span>
                        <span v-show="!options.watch_till_end"><span class="fas fa-2x fa-toggle-off"></span></span>
                    </td>
                </tr>
                <tr v-on:click="options.show_who_has_seen = !options.show_who_has_seen">
                    <td>
                        <span>Show players who have seen the anime being blindtested</span>
                    </td>
                    <td class="option_control">
                        <span v-show="options.show_who_has_seen"><span class="fas fa-2x fa-toggle-on"></span></span>
                        <span v-show="!options.show_who_has_seen"><span class="fas fa-2x fa-toggle-off"></span></span>
                    </td>
                </tr>
            </table>
        </div>
    `
});
