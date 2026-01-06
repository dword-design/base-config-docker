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
    useJobMatrix: false, // TODO: Check if we can support macOS and Windows to support Docker in GitHub Actions
    ...(!packageConfig.private && {
      deployEnv: {
        DOCKER_REGISTRY_PASSWORD: '${{ secrets.DOCKER_PASSWORD }}',
        DOCKER_REGISTRY_USER: '${{ secrets.DOCKER_USERNAME }}',
      },
      deployPlugins: [
        [
          packageName`@codedependant/semantic-release-docker`,
          {
            dockerFile: 'index.dockerfile',
            dockerImage: imageName,
            dockerPlatform: ['linux/amd64', 'linux/arm64'],
          },
        ],
      ],
      preDeploySteps: [
        { name: 'Set up QEMU', uses: 'docker/setup-qemu-action@v3' },
        { name: 'Set up Docker Buildx', uses: 'docker/setup-buildx-action@v3' },
      ],
    }),
  };
});
