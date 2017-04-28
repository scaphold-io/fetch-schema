#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander')
var rp = require('request-promise')
import {
  printSchema,
  buildClientSchema,
  introspectionQuery,
  ExecutionResult ,
  IntrospectionQuery
} from 'graphql'
import * as fs from 'fs'
import * as path from 'path'

program
  .version('0.0.1')

program
  .arguments('<url>')
  .option('-f, --filename <name>', 'File to save the schema in')
  .action((url: string) => {
    if (!url) {
      console.error('Please provide a url to your GraphQL API')
      process.exit(1)
    }
    const filename = program.filename ? program.filename : 'schema.graphql'
    rp({
      uri: url,
      method: 'POST',
      headers: {},
      body: {
        query: introspectionQuery
      },
      json: true
    }).then((res: ExecutionResult) => {
      const schema = buildClientSchema(res.data as IntrospectionQuery)
      console.log(`Saving schema to file ${filename}`)
      fs.writeFileSync(path.join(process.cwd(), filename), printSchema(schema))
    })
  })

program.parse(process.argv);
if (program.args.length === 0) {
  console.error('Please provide a url that points to a GraphQL API')
  process.exit(1)
}
