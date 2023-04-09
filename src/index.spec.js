import { Base } from '@dword-design/base'
import fs from 'fs-extra'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  works() {
    return withLocalTmpDir(async () => {
      await fs.outputFile(
        'package.json',
        JSON.stringify({
          name: '@dword-design/docker-foo',
        }),
      )
      await new Base({ name: '../src/index.js' }).prepare()
      expect(await fs.readJson('.releaserc.json')).toMatchSnapshot(this)
    })
  },
}
