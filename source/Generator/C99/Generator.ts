// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import { Error, IO, Uri, Utilities } from "@cogneco/mend"
import * as C99 from "./SyntaxTree"

export class Generator extends IO.Indenter {
	private lastNode: C99.Node | undefined
	private constructor(writer: IO.Writer, private readonly handler: Error.Handler) {
		super(writer)
	}
	raise(message: string) {
		this.handler.raise(message, Error.Level.Recoverable, "generator", this.lastNode ? this.lastNode.region : undefined)
	}
	async generate(node: C99.Node | C99.Node[] | Utilities.Enumerator<C99.Node>): Promise<boolean> {
		let result = false
		if (node instanceof C99.Node) {
			this.lastNode = node
			const generate = Generator.generators[node.class]
			result = generate != undefined && await generate(this, node)
		} else if (node instanceof Array)
			result = await node.map(n => this.generate(n)).reduce(async (r, n) => await r && n, Promise.resolve(true))
		else if (node instanceof Utilities.Enumerator)
			result = await node.map(n => this.generate(n)).reduce(async (r, n) => await r && n, Promise.resolve(true))
		return result
	}
	create(name: string): Promise<Generator | undefined> {
		return Generator.create(this.resource.folder.appendPath(name), this.handler)
	}
	static generators: { [className: string]: ((generator: Generator, node: C99.Node) => Promise<boolean>) } = {}
	static add<T extends C99.Node>(className: string, generate: (generator: Generator, node: T) => Promise<boolean>) {
		Generator.generators[className] = generate as (generator: Generator, node: C99.Node) => Promise<boolean>
	}
	static async create(resource: Uri.Locator, handler: Error.Handler): Promise<Generator | undefined> {
		const writer = await IO.Writer.open(resource)
		return writer && new Generator(writer, handler)
	}
}