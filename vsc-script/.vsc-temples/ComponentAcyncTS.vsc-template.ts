import * as vsc from 'vsc-base'

//vsc-template-name: Component Async Ts

export async function Template(): Promise<vsc.vscTemplate> {
   await vsc.sleep(50);
   return {
      userInputs: [
         {
            title: 'What is the Component Name',
            argumentName: 'name', // will become input in template
            defaultValue: 'test'
         }
      ],
      template: [
         {
            type: 'folder',
            name: inputs => `${vsc.toPascalCase(inputs.name)}Component`,
            children: [
               {
                  type: 'file',
                  name: inputs => `${vsc.toPascalCase(inputs.name)}.js`,
                  content: inputs => `import React from 'react'

const ${vsc.toPascalCase(inputs.name)} = ({ value }) => (
	<div class='${vsc.toKebabCase(inputs.name)}'>{value}</div>
)

export default ${vsc.toPascalCase(inputs.name)}
`
               },
               {
                  type: 'file',
                  name: inputs => `${vsc.toPascalCase(inputs.name)}.css`,
                  content: inputs => `
.${vsc.toKebabCase(inputs.name)} {
	display: block;
}
`
               }
            ]
         }
      ]
   }
}
