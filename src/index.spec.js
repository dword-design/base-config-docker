import execa from 'execa'
import outputFiles from 'output-files'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  works() {
    return withLocalTmpDir(async () => {
      await outputFiles({
        'node_modules/base-config-self/index.js':
          "module.exports = require('../../../src')",
        'package.json': JSON.stringify({
          baseConfig: 'self',
          name: '@dword-design/docker-foo',
        }),
      })
      await execa.command('base prepare')
      expect(require(P.resolve('.releaserc.json'))).toMatchSnapshot(this)
    })
  },
}
