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

import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Expression } from "../Expression"

export class String extends Expression {
	constructor(readonly value: string, tokens: Tokens.Substance[]) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "literal.string",
			value: this.value,
		}
	}
	// tslint:disable:ban-types no-construct
	static parse(source: Source): String {
		let result: String
		if (source.peek() instanceof Tokens.Literals.String)
			result = new String((source.next() as Tokens.Literals.String).value, source.mark())
		return result
	}
}
Expression.addParser(String.parse)