import { writeFile } from 'fs'
import { promisify } from 'util'
import getTheme from './getTheme.mjs'
import colors from './colors.mjs'

const promisifiedWriteFile = promisify(writeFile)

// These variants need to be listed as seperate themes in the package.json
const VARIANTS = {
  srnaves: (color) => color,
}

const getExportPath = (name) => `./dist/${name}.json`

const buildTheme = async () => {
  try {
    await Promise.all(
      Object.entries(VARIANTS).map(([variantName, getColor]) => {
        const themeWithColors = getTheme({
          name: variantName,
          colors: Object.entries(colors).reduce(
            (acc, [colorName, colorValue]) => ({
              ...acc,
              [colorName]: getColor(colorValue)
            }),
            {}
          )
        })

        return promisifiedWriteFile(
          getExportPath(variantName),
          JSON.stringify(themeWithColors)
        )
      })
    )
    console.log('Theme built.')
  } catch (error) {
    console.log(error)
  }
}

buildTheme()
