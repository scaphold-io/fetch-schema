#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander')
var rp = require('request-promise')
const chalk = require('chalk')
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
      console.log(chalk.red('Please provide a url to your GraphQL API'))
      process.exit(1)
    }
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
      if (program.filename) {
        const p = path.join(process.cwd(), program.filename)
        console.log(chalk.cyan(`Saving schema to ${p}`))
        fs.writeFileSync(p, printSchema(schema))
      } else {
        console.log(chalk.cyan(printSchema(schema)))
      }
    })
  })

program.parse(process.argv);
if (program.args.length === 0) {
  console.log(chalk.red('Please provide a url that points to a GraphQL API'))
  process.exit(1)
}
