import mkdirp from 'mkdirp'
import ncp from 'ncp'

const main = async () => {
  await Promise.all([mkdirp('./page/js'), mkdirp('./page/css')])
  ncp('./src/index.html', './page/index.html', (err) => err && console.log(err))
  ncp('./src/css', './page/css', (err) => err && console.log(err))
}

main()
