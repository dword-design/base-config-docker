import packageName from 'depcheck-package-name'
import loadPkg from 'load-pkg'
import parsePkgName from 'parse-pkg-name'

const packageConfig = loadPkg.sync()

const name = parsePkgName(packageConfig.name).name

export default {
  allowedMatches: ['Dockerfile', 'index.usesdocker.spec.js'],
  ...(!packageConfig.private && {
    deployEnv: {
      DOCKER_PASSWORD: '${{ secrets.DOCKER_PASSWORD }}',
      DOCKER_USERNAME: '${{ secrets.DOCKER_USERNAME }}',
    },
    deployPlugins: [
      [
        packageName`semantic-release-docker`,
        {
          name: `dworddesign/${name.replace(/^docker-/, '')}`,
        },
      ],
    ],
  }),
}
