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

let file = fs.readFileSync(process.argv[2], { encoding: 'utf-8' });

const versionStr = file.match(/"version": "[\d.]*"/g)[0];

const versionNum = versionStr.replace('"version": ', '').replace(/"/g, '');

const [majorVersion, minorVersion, patchVersion] = versionNum.split('.');

const newVersion = `"version": "${
  increaseVersion === '--major' ? Number(majorVersion) + 1 : majorVersion
}.${increaseVersion === '--minor' ? Number(minorVersion) + 1 : minorVersion}.${
  increaseVersion === '--patch' ? Number(patchVersion) + 1 : patchVersion
}"`;

file = file.replace(versionStr, newVersion);

fs.writeFileSync(process.argv[2], file);
fs.writeFileSync('lib/package.json', file);
