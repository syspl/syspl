// Copyright (C) 2018 Simon Mika <simon@mika.se>
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
import * as Type from "./Type"
import { Declaration } from "./Declaration"
import { Expression } from "./Expression"
import { Operator } from "./Operator"
import { Node } from "./Node"

export abstract class UnaryOperator extends Operator {
	constructor(symbol: string, precedence: number, readonly argument: Expression, readonly declaration?: Declaration, type?: Type.Expression, tokens?: Utilities.Iterable<Tokens.Substance> | Node) {
		super(symbol, precedence, declaration, type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			argument: this.argument.serialize(),
		}
	}
}
