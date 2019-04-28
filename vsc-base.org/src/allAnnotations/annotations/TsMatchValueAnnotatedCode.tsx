import React from 'react'
import AnnotatedCode from 'components/AnnotatedCode/AnnotatedCode'



const TsMatchValueAnnotatedCode = ({ open = false }: {open?: boolean}) => {
   return (
      <AnnotatedCode
         id={'tsMatchValue'}
         title={'tsMatchValue'}
         open={open}
         annotation={
            <>
               <p>
                  
 Test if node is an value: string expression, number expression or boolean (true or false) 
               </p>
               <p>
                and match the value: true, false, a number, a string, 
               </p>
               <p>
                A RegExp can be applied for string/number search. 
               </p>
               <p>
                Optional test hasAncestor. 
               </p>
               <p>
                See <a href='http://vsc-base.org/#tsHasAncestor'>tsHasAncestor</a> and <a href='http://vsc-base.org/#tsHasAncestors'>tsHasAncestors</a>
               </p>
            </>
         }
         
         codeOneLineEx={`const found = vsc.tsMatchValue(node, value)`}
         codeEx={`
// Found a NumberExpression with value 12
const foundNumberExpression = vsc.tsMatchValue(node, 12)
// Found a NumberExpression with value 12, with a parant EnumValue
const foundNumberExpression = vsc.tsMatchValue(node, 12, \{
   hasParent: parent => vsc.matchEnum(parent)
})`}
         code={`/**
 * @vscType ts
 * @returns boolean
 */
export const tsMatchValue: (
   node: ts.Node | undefined,
   value: (RegExp | string | number | boolean | null),
   options?: \{
      hasAncestor?: (parent: ts.Node, depth: number) => boolean
      hasAncestors?: [(parent: ts.Node, depth: number) => boolean]
   }
) => boolean = (node, matchValue, options) => \{
   if (node === undefined) \{
      return false
   }
   if (matchValue === null && node.kind !== ts.SyntaxKind.NullKeyword) \{
      return false
   }
   if (matchValue === true && node.kind !== ts.SyntaxKind.TrueKeyword) \{
      return false
   }
   if (matchValue === false && node.kind !== ts.SyntaxKind.FalseKeyword) \{
      return false
   }
   if (
      typeof matchValue === 'string'
      &&
      (!ts.isStringLiteral(node) || matchValue !== node.text)
   ) \{
      return false
   }
   //ts's NumericLiteral has prop text that is s string, so we cast the matchValue.
   if (
      typeof matchValue === 'number'
      &&
      (!ts.isNumericLiteral(node) || '' + matchValue !== node.text)
   ) \{
      return false
   }
   if (
      matchValue instanceof RegExp
      &&
      (
         !ts.isNumericLiteral(node)
         || !ts.isStringLiteral(node)
         || matchValue.test(node.text)
      )
   ) \{
      return false
   }
   if (!options) \{
      return true
   }
   const \{
      hasAncestor,
      hasAncestors,
   } = options;
   if (hasAncestor && !vsc.tsHasAncestor(node, hasAncestor)) \{
      return false
   }
   if (hasAncestors && !vsc.tsHasAncestors(node, hasAncestors)) \{
      return false
   }
   return true
}
`}
      />
   )
}

export default TsMatchValueAnnotatedCode

