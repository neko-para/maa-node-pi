import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'
import 'vuetify/styles'

export default createVuetify({
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  },
  directives,
  blueprint: md3
})
