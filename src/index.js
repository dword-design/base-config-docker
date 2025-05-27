import packageName from 'depcheck-package-name'
import loadPkg from 'load-pkg'
import parsePackagejsonName from 'parse-packagejson-name'

export default () => {
  const packageConfig = loadPkg.sync()

  const name = parsePackagejsonName(packageConfig.name).fullName

  const imageName = `dworddesign/${name.replace(/^docker-/, '')}`

  return {
    allowedMatches: ['index.dockerfile', 'index.spec.js'],
    ...(!packageConfig.private && {
      deployEnv: {
        DOCKER_PASSWORD: '${{ secrets.DOCKER_PASSWORD }}',
        DOCKER_USERNAME: '${{ secrets.DOCKER_USERNAME }}',
      },
      deployPlugins: [
        [
          packageName`semantic-release-docker`,
          {
            name: imageName,
          },
        ],
      ],
      preDeploySteps: [
        { run: `docker build --file index.dockerfile --tag ${imageName} .` },
      ],
    }),
  }
}
