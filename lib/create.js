const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const colors = require("colors/safe");
const clone = require('git-clone');
const execSync = require('child_process').execSync;

// Set prompt as green
prompt.message = colors.green("Replace");

/*
 * Command function
 */

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default';
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`;
  const localPath = process.cwd();

  /*
   * Copy Template
   */
    logger.info('Please fill App name and description..');
    prompt.start().get(['app','description'], (err, result) => {
        let dir = result.app
        let fullPath = path.join(localPath, dir)
        if (!fs.existsSync(fullPath)){
            fs.mkdir(path.join(localPath, dir), (err) => {
                if (err) {
                    return logger.error(err);
                }
                  
                logger.log('Directory created successfully!');
                logger.info('Clonning files…');
                clone('git@github.com:qantra-io/axion.git', fullPath, {shallow:true},()=>{
                    logger.info('✔ The files have been cloned!');
                    let pjson = require(`${fullPath}/package.json`)
                    pjson.name = result.app.trim()
                    pjson.description = result.description.trim()
                    fs.writeFile(`${fullPath}/package.json`, JSON.stringify(pjson, null, 2), function writeJSON(err) {
                        if (err) return logger.error(err);
                        execSync('npm install', {stdio:[0,1,2], cwd:fullPath});
                        execSync('rm -rf .git', {stdio:[0,1,2], cwd:fullPath});
                    });
                })
                logger.info('✔ Success!');

            });
        }else logger.error('Direcotory already exists! Delete it or choose another name.')

    });

//   if (fs.existsSync(templatePath)) {
//     logger.info('Clonning files…');
//     clone('git@github.com:gothinkster/node-express-realworld-example-app.git',localPath,{shallow:true},()=>{
//         logger.info('✔ The files have been copied!');
//     })
//   } else {
//     logger.error(`The requested template for ${args.template} wasn’t found.`)
//     process.exit(1);
//   }

//   /*
//    * File variables
//    */

//   const variables = require(`${templatePath}/_variables`);

//   // Remove variables file from the current directory
//   // since it only is needed on the template directory
//   if (fs.existsSync(`${localPath}/_variables.js`)) {
//     shell.rm(`${localPath}/_variables.js`);
//   }

//   logger.info('Please fill the following values…');

//   // Ask for variable values
//   prompt.start().get(variables, (err, result) => {

//     // Remove MIT License file if another is selected
//     if (result.license !== 'MIT') {
//       shell.rm(`${localPath}/LICENSE`);
//     }

//     // Replace variable values in all files
//     shell.ls('-Rl', '.').forEach(entry => {
//       if (entry.isFile()) {
//         // Replace '[VARIABLE]` with the corresponding variable value from the prompt
//         variables.forEach(variable => {
//           shell.sed('-i', `\\[${variable.toUpperCase()}\\]`, result[variable], entry.name);
//         });

//         // Insert current year in files
//         shell.sed('-i', '\\[YEAR\\]', new Date().getFullYear(), entry.name);
//       }
//     });

//     logger.info('✔ Success!');
//   });
}