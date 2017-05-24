// Copyright (C) 2017  Simon Mika <simon@mika.se>
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
import { Source } from "../Source"
import { Expression } from "./Expression"
import * as Tokens from "../../Tokens"

export class Discard extends Expression {
	constructor(tokens: Tokens.Substance[]) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "symbol.discard",
		}
	}
	static parse(source: Source): Discard {
		return source.peek().isIdentifier("_") && source.next() ? new Discard(source.mark()) : null
	}
}
Expression.addParser(Discard.parse)
