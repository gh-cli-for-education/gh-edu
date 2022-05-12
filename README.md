[WIP]

## Keep in mind
As plugins artists you have total freedom to develop the extension as you want.
But for consistency's sake keep in mind the next points:

To load the configuration file you can add this code (js/ts)
```js
/** Load configuration */
import fs from 'fs'
const stringConfig = fs.readFileSync(process.cwd() + "/../gh-edu/config.json", { encoding: "utf8", flag: "r" })
const config = JSON.parse(stringConfig);
/** END loadConfig */
```
More solutions will be available for diferents languages

- ``-f, --force`` will not ask for user input.
- The options ``-s, --silence``, will mute log information and user input.
These options have been designed with scripting in mind.
Output result ignore these flags.

Upload node\_modules to github the gh installation process doesn't install any 
dependency
