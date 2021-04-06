import packageName from 'depcheck-package-name'
import loadPkg from 'load-pkg'
import parsePkgName from 'parse-pkg-name'

const packageConfig = loadPkg.sync()

const name = parsePkgName(packageConfig.name).name

const imageName = `dworddesign/${name.replace(/^docker-/, '')}`

export default {
  allowedMatches: ['index.dockerfile', 'index.usesdocker.spec.js'],
  ...(!packageConfig.private && {
    deployEnv: {
      DOCKER_PASSWORD: '${{ secrets.DOCKER_PASSWORD }}',
      DOCKER_USERNAME: '${{ secrets.DOCKER_USERNAME }}',
    },
    deployPlugins: [
      [
        packageName`@semantic-release/exec`,
        {
          prepareCmd: `docker build --file index.dockerfile --tag ${imageName} .`,
        },
      ],
      [
        packageName`semantic-release-docker`,
        {
          name: imageName,
        },
      ],
    ],
  }),
}
