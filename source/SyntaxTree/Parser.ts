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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Source } from "./Source"
import { Module } from "./Module"
import { Statement } from "./Statement"

export class Parser implements Utilities.Iterator<Module> {
	source: Source
	private constructor(tokens: Utilities.Iterator<Tokens.Substance>, handler: Error.Handler) {
		this.source = new Source(tokens, handler)
	}
	next(): Module | undefined {
		return Module.parse(this.source)
	}
	static create(tokens: undefined, handler: Error.Handler): undefined
	static create(tokens: Utilities.Iterator<Tokens.Token> | string, handler: Error.Handler): Utilities.Iterator<Module>
	static create(tokens: Utilities.Iterator<Tokens.Token> | string | undefined, handler: Error.Handler): Utilities.Iterator<Module> | undefined
	static create(tokens: string | Utilities.Iterator<Tokens.Token> | undefined, handler: Error.Handler): Utilities.Iterator<Module> | undefined {
		return tokens == undefined ? undefined : new Parser(new Tokens.GapRemover(typeof tokens === "string" ? Tokens.Lexer.create(tokens, handler) : tokens), handler)
	}
	static open(path: string | undefined, handler: Error.Handler): Utilities.Iterator<Module> | undefined {
		return path ? Parser.create(Tokens.Lexer.open(path, handler), handler) : undefined
	}
	static parseFirst(tokens: string | Utilities.Iterator<Tokens.Token>, handler: Error.Handler): Statement | undefined {
			const parser = Parser.create(tokens, handler)
			let module: Module | undefined
			let statements: Utilities.Iterator<Statement>
			return parser != undefined && (module = parser.next()) && (statements = module.statements) ? statements.next() : undefined
	}
}
