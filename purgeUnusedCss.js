// https://gist.github.com/t1mwillis/4b14716258ea73660586115dc0c965d3

/**
 * Scan through all vue components and search for helper styles that are used
 * Then return those that aren't so that they can be purged
 */
const { readFileSync } = require('fs')
const { sync } = require('glob')

// Vuetify exists in both pages, components and layouts
const everyVueComponent = sync('./+(components|pages|layouts)/**/*.vue')

const usedClasses = {}

everyVueComponent.forEach((component) => {
  findVuetifyHelpers(component)
})

function findVuetifyHelpers (filename) {
  const contents = readFileSync(filename, 'utf8')
  const templateContents = contents.split('<script>')[0]

  // each match is for a specific helper class, if it returns null we do || [] so we can still use spread.
  // probably should instantiate these regexes somewhere else instead of inline
  const marginPaddingMatches =
    templateContents.match(
      /(m|p)(t|b|l|r|a|x|y)+(-sm|-md|-lg|-xl)*-n*\d{1,2}/g
    ) || []

  const marginAutoMatches =
    templateContents.match(/m(t|b|l|r|a|x|y)+(-sm|-md|-lg|-xl)*-auto/g) || []

  const alignMatches =
    templateContents.match(
      /align(-sm|-md|-lg|-xl)*-(start|center|end|space-between|space-around|stretch)/g
    ) || []
  const flexDirMatches =
    templateContents.match(
      /flex(-sm|-md|-lg|-xl)*-(row|row-reverse|column|column-reverse)/g
    ) || []
  const flexJustMatches =
    templateContents.match(
      /justify(-sm|-md|-lg|-xl)*-(start|end|center|space-between|space-around)/g
    ) || []
  const alignSelfMatches =
    templateContents.match(
      /align-self(-sm|-md|-lg|-xl|)*-(start|end|center|baseline|auto|stretch)/g
    ) || []
  const flexWrapMatches =
    templateContents.match(
      /flex(-sm|-md|-lg|-xl|)*-(wrap|nowrap|wrap-reverse)/g
    ) || []
  const flexGrowMatches =
    templateContents.match(
      /flex(-sm|-md|-lg|-xl|)*-(grow-0|grow-1|shrink-0|shrink-1)/g
    ) || []
  const displayMatches =
    templateContents.match(
      /d(-sm|-md|-lg|-xl|)*-(none|block|inline-block|inline|table|table-cell|table-row|flex|inline-flex)/g
    ) || []
  const floatMatches =
    templateContents.match(/float(-sm|-md|-lg|-xl|)*-(none|left|right)/g) || []
  const hiddenMatches =
    templateContents.match(
      /hidden(-sm|-md|-lg|-xl|-xs)+-(and-up|and-down|only)/g
    ) || []

  /* commenting this out as it is somewhat difficult and requires for the
  checking of props on v-cols
  const orderMatches = templateContents.match(/order(-sm|-md|-lg|-xl)*-\d{1,2}/g)
  const orderColMatches = templateContents.match(/(order|lg|md|sm|xl)="\d{1,2}"/g)
  const [className, size] = match.split(`="`)
      const classNameMinusOrder = className.replace('order', '')
      const cleanedMatch = `order-${classNameMinusOrder}${
        classNameMinusOrder ? '-' : ''
      }${size.slice(0, -1)}`
  */

  // iterate over all the matches and write them to our "used classes" obj
  const allMatches = [
    ...alignMatches,
    ...flexDirMatches,
    ...flexJustMatches,
    ...alignSelfMatches,
    ...flexWrapMatches,
    ...flexGrowMatches,
    ...displayMatches,
    ...floatMatches,
    ...hiddenMatches,
    ...marginAutoMatches,
    ...marginPaddingMatches
  ]
  if (allMatches) {
    allMatches.map((match) => {
      if (usedClasses[match]) {
        usedClasses[match] = usedClasses[match] + 1
      } else {
        usedClasses[match] = 1
      }
    })
  }
}

// this is not required but simply nice to see them in order
const ordered = Object.keys(usedClasses)
  .sort()
  .reduce((obj, key) => {
    obj[key] = usedClasses[key]
    return obj
  }, {})

// this is not ideal but alternative is likely just reading SCSS directly
const responsive = ['', '-sm', '-md', '-lg', '-xl']

const align = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'stretch'
]
  .map((last) => {
    return responsive.map((middle) => {
      return `align${middle}-${last}`
    })
  })
  .flat(2)

const flexDir = ['row', 'row-reverse', 'column', 'column-reverse']
  .map((last) => {
    return responsive.map((middle) => {
      return `flex${middle}-${last}`
    })
  })
  .flat(2)

const flexJust = ['start', 'end', 'center', 'space-between', 'space-around']
  .map((last) => {
    return responsive.map((middle) => {
      return `justify${middle}-${last}`
    })
  })
  .flat(2)

const alignSelf = ['start', 'end', 'center', 'baseline', 'auto', 'stretch']
  .map((last) => {
    return responsive.map((middle) => {
      return `align-self${middle}-${last}`
    })
  })
  .flat(2)

const alignContent = [
  'start',
  'end',
  'center',
  'space-between',
  'space-around',
  'stretch'
]
  .map((last) => {
    return responsive.map((middle) => {
      return `align${middle}-content-${last}`
    })
  })
  .flat(2)

const flexWrap = ['wrap', 'nowrap', 'wrap-reverse']
  .map((last) => {
    return responsive.map((middle) => {
      return `flex${middle}-${last}`
    })
  })
  .flat(2)

const flexGrow = ['grow-0', 'grow-1', 'shrink-0', 'shrink-1']
  .map((last) => {
    return responsive.map((middle) => {
      return `flex${middle}-${last}`
    })
  })
  .flat(2)

const displayHelpers = [
  'none',
  'inline',
  'inline-block',
  'block',
  'table',
  'table-cell',
  'table-row',
  'flex',
  'inline-flex'
].map((last) => {
  return responsive.map((middle) => {
    return `d${middle}-${last}`
  })
})
const floatHelpers = ['none', 'left', 'right'].map((last) => {
  return responsive.map((middle) => {
    return `float${middle}-${last}`
  })
})
const hiddenHelpers = ['only', 'and-down', 'and-up'].map((last) => {
  return ['xs', 'sm', 'md', 'lg', 'xl'].map((middle) => {
    return `hidden${middle}-${last}`
  })
})

const marginPaddingHelpers = ['m', 'p']
  .map((first) => {
    return ['t', 'b', 'l', 'r', 'x', 'y', 'a', 's', 'e'].map((second) => {
      return responsive.map((third) => {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((four) => {
          return first === 'm'
            ? [
                `${first}${second}${third}-${four}`,
                `${first}${second}${third}-n${four}`
              ]
            : [`${first}${second}${third}-${four}`]
        })
      })
    })
  })
  .flat(4)

const marginAutoHelpers = ['t', 'b', 'l', 'r', 'x', 'y', 'a', 's', 'e']
  .map((second) => {
    return responsive.map((third) => {
      return `m${second}${third}-auto`
    })
  })
  .flat(2)

// again, orderClasses have been somewhat difficult to find/test
// const orderClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// .map((third) => {
//   return responsive.map((second) => {
//     return `order${second}-${third}`
//   })
// })
// .flat(2)

const allPossibleVuetifyClasses = [
  ...marginAutoHelpers,
  ...marginPaddingHelpers,
  ...align,
  ...flexDir,
  ...flexJust,
  ...alignSelf,
  ...alignContent,
  ...flexWrap,
  ...flexGrow,
  ...displayHelpers,
  ...floatHelpers,
  ...hiddenHelpers
]

// all these are not used and thus can be purged
const purgableClasses = allPossibleVuetifyClasses.filter((possible) => {
  return !Object.keys(ordered).includes(possible)
})

// css bye bye takes a rule as a string, each of these classes looks like
// .v-application .${helperclass}
const rules = purgableClasses.map((rule) => {
  return `.v-application .${rule}`
})

// console.log(Object.keys(ordered))
// console.log(`found ${Object.keys(ordered).length} helpers used`)
// console.log(`purging remaining ${rules.length} helpers`)

module.exports = rules
