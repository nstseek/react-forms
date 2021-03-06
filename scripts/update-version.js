const fs = require('fs');

const increaseVersion = process.argv[3];

if (
  increaseVersion !== '--major' &&
  increaseVersion !== '--minor' &&
  increaseVersion !== '--patch'
) {
  console.log(
    'The third argument must indicate this release type\nPossible options: --major, --minor, --patch'
  );
  process.exit(1);
}

let packageBuild = fs.readFileSync(process.argv[2], { encoding: 'utf-8' });

let packageJson = fs.readFileSync('package.json', { encoding: 'utf-8' });

const versionStr = packageBuild.match(/"version": "[\d.]*"/g)[0];

const versionNum = versionStr.replace('"version": ', '').replace(/"/g, '');

const [majorVersion, minorVersion, patchVersion] = versionNum.split('.');

let newVersion;

switch (increaseVersion) {
  case '--major':
    newVersion = `"version": "${Number(majorVersion) + 1}.0.0"`;
    break;
  case '--minor':
    newVersion = `"version": "${majorVersion}.${Number(minorVersion) + 1}.0"`;
    break;
  case '--patch':
    newVersion = `"version": "${majorVersion}.${minorVersion}.${
      Number(patchVersion) + 1
    }"`;
    break;
}

packageBuild = packageBuild.replace(versionStr, newVersion);

fs.writeFileSync(process.argv[2], packageBuild);
fs.writeFileSync('lib/package.json', packageBuild);

const packageJsonVersion = packageJson.match(/"version": "[\d.]*"/g)[0];

packageJson = packageJson.replace(packageJsonVersion, newVersion);

fs.writeFileSync('package.json', packageJson);
