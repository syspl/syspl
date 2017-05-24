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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Source } from "./Source"
import { Statement } from "./Statement"
import { Node } from "./Node"

export class Module extends Node {
	private namespace: string[]
	get statements(): Utilities.Iterator<Statement> {
		return new Utilities.ArrayIterator(this.statementsArray)
	}
	constructor(private statementsArray: Statement[], tokens: Tokens.Substance[]) {
		super(tokens)
		this.namespace = tokens[0].region!.resource.split("/")
	}
	serialize(): { class: string } & any {
		return {
			class: "module",
			statements: this.statementsArray.map(s => s.serialize()),
		}
	}
	static parse(source: Source): Module | undefined {
		let result: Module | undefined
		if (source.peek()) {
			const statements: Statement[] = []
			let next: Statement | undefined
			while (next = Statement.parse(source.clone()))
				statements.push(next)
			if (!(source.next() as Tokens.EndOfFile))
				source.raise("Missing end of file.")
			result = new Module(statements, source.mark())
		}
		return result
	}
}
