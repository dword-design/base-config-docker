import { type Base, defineBaseConfig } from '@dword-design/base';
import packageName from 'depcheck-package-name';
import parsePackagejsonName from 'parse-packagejson-name';
import { readPackageSync } from 'read-pkg';

export default defineBaseConfig(function (this: Base) {
  const packageConfig = readPackageSync({ cwd: this.cwd });
  const name = parsePackagejsonName(packageConfig.name).fullName;
  const imageName = `dworddesign/${name.replace(/^docker-/, '')}`;
  return {
    allowedMatches: ['index.dockerfile', 'index.spec.ts'],
    useJobMatrix: false,
    ...(!packageConfig.private && {
      deployEnv: {
        DOCKER_PASSWORD: '${{ secrets.DOCKER_PASSWORD }}',
        DOCKER_USERNAME: '${{ secrets.DOCKER_USERNAME }}',
      },
      deployPlugins: [
        [packageName`semantic-release-docker`, { name: imageName }],
      ],
      preDeploySteps: [
        { run: `docker build --file index.dockerfile --tag ${imageName} .` },
      ],
    }),
  };
});
