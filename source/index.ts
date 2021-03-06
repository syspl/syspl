// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of SysPL.
//
// SysPL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SysPL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SysPL.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error, Uri, Utilities } from "@cogneco/mend"
import * as Parser from "./Parser"
import * as Resolver from "./Resolver"
import * as C99 from "./C99"

export class Program {
	readonly version = "0.1.1"
	private defaultCommand = "build"
	constructor(private commands: (string | undefined)[]) {
		this.commands = this.commands.slice(2)
		if (this.commands.length == 0) {
			this.commands.push(this.defaultCommand)
			this.commands.push(".")
		}
	}
	private async runHelper(command: string | undefined, commands: (string | undefined)[]) {
		const handler = new Error.ConsoleHandler()
		switch (command) {
			case "c99-build":
				{
					const resource = Uri.Locator.parse(commands.pop())
					if (!resource)
						handler.raise("Missing path to open.", Error.Level.Critical, "usage")
					else {
						const parser = Parser.open(resource, handler)
						if (!parser)
							handler.raise("Failed to open " + resource.toString() + ".", Error.Level.Critical, "parser")
						else {
							const modules = Utilities.Enumerable.from(parser.toArray())
							const [declarations, types] = Resolver.resolve(handler, modules)
							const cCode = new C99.Converter(declarations, types, handler).convert(modules)
							const generator = await C99.Generator.create(resource.folder, handler)
							if (!(generator && await generator.generate(cCode)))
								handler.raise("Failed to generate output to " + resource.folder.toString() + ".", Error.Level.Critical, "generate")
						}
					}
				}
				break
			case "c99-json":
				{
					const resource = Uri.Locator.parse(commands.pop())
					const parser = Parser.open(resource, handler)
					if (parser) {
						const modules = Utilities.Enumerable.from(parser.toArray())
						const [declarations, types] = Resolver.resolve(handler, modules)
						const cCode = new C99.Converter(declarations, types, handler).convert(modules)
						console.log(JSON.stringify(cCode.map(m => m.serialize()).toArray(), undefined, "\t"))
					}
				}
				break
			case "json":
				{
					const resource = Uri.Locator.parse(commands.pop())
					const parser = Parser.open(resource, handler)
					if (parser) {
						const modules = Utilities.Enumerable.from(parser.toArray())
						const [declarations, types] = Resolver.resolve(handler, modules)
						let result = modules.map(module => module.serialize()).toArray()
						result = declarations.patch(result)
						result = types.patch(result)
						console.log(JSON.stringify(result, undefined, "\t"))
					}
				}
				break
			case "version":
				console.log("syspl " + this.version)
				break
			case "help":
				console.log("help")
				break
			default:
				commands.push(command)
				command = undefined
				this.runHelper(this.defaultCommand, commands)
				break
		}
		if (command)
			this.defaultCommand = command
	}
	run() {
		let command: string | undefined
		while (command = this.commands.shift()) {
			this.runHelper(command, this.commands)
		}
	}
}

const syspl = new Program(process.argv)
syspl.run()
console.error("syspl " + syspl.version)
