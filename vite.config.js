import vue from '@vitejs/plugin-vue'
import postcssPresetEnv from 'postcss-preset-env'
import { resolve } from 'path'

export default {
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    css: {
        postcss: {
            plugins: [
                postcssPresetEnv({
                    stage: 0
                })
            ]
        }
    }
}
