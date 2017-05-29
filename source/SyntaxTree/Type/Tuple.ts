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
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import { Source } from "../Source"

export class Tuple extends Expression {
	get children(): Utilities.Iterator<Expression> {
		return new Utilities.ArrayIterator(this.childrenArray)
	}
	constructor(private childrenArray: Expression[], tokens: () => Utilities.Iterator<Tokens.Substance>) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "type.tuple",
			children: this.childrenArray.map(c => c.serialize()),
		}
	}
	static parse(source: Source): Expression | undefined {
		let result: Expression | undefined
		if (source.peek()!.isSeparator("(") && source.next()) {
			const children: Expression[] = []
			let child: Expression | undefined
			while (child = Expression.parse(source.clone())) {
				children.push(child)
				if (!source.peek()!.isSeparator(","))
					break
				source.next() // consume ,
			}
			if (!source.next()!.isSeparator(")"))
				source.raise("Expected \")\"")
			result = new Tuple(children, source.mark())
		}
		return result
	}
}
Expression.addParser(Tuple.parse)
