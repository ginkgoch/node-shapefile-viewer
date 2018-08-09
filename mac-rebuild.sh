rm -rf node_modules/
rm -rf release-builds/
npm i --production
npm run mac-build
du -sh release-builds/
