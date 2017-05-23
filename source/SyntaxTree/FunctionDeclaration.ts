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
import { Statement } from "./Statement"
import { Declaration } from "./Declaration"
import * as Type from "./Type"
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Block } from "./Block"
import { FunctionModifier } from "./FunctionModifier"

export class FunctionDeclaration extends Declaration {
	get typeParameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.typeParametersArray)
	}
	get argumentList(): Utilities.Iterator<ArgumentDeclaration> {
		return new Utilities.ArrayIterator(this.argumentsArray)
	}
	constructor(symbol: Type.Name, readonly modifier: FunctionModifier, private typeParametersArray: Type.Name[], private argumentsArray: ArgumentDeclaration[], readonly returnType: Type.Expression, readonly body: Block, tokens: Tokens.Substance[]) {
		super(symbol.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "functionDeclaration",
			modifier: this.modifier,
			typeParameters: this.typeParametersArray.map(t => t.serialize()),
			arguments: this.argumentsArray.map(a => a.serialize()),
			returnType: this.returnType.serialize(),
			body: this.body.serialize(),
		}
	}
	static parse(source: Source): FunctionDeclaration {
		let result: FunctionDeclaration
		let modifier = FunctionModifier.None
		switch ((source.peek() as Tokens.Identifier).name) {
			case "static":
				modifier = FunctionModifier.Static
				break
			case "abstract":
				modifier = FunctionModifier.Abstract
				break
			case "virtual":
				modifier = FunctionModifier.Virtual
				break
			case "override":
				modifier = FunctionModifier.Override
				break
			default:
				break
		}
		if (source.peek(modifier == FunctionModifier.None ? 0 : 1).isIdentifier("func") && source.next() && (modifier == FunctionModifier.None || source.next())) {
			const symbol = Type.Name.parse(source.clone())
			// TODO: add overload name parsing: ~overloadName
			const typeParameters = Declaration.parseTypeParameters(source.clone())
			const argumentList = ArgumentDeclaration.parseAll(source.clone())
			let returnType: Type.Expression
			if (source.peek().isOperator("->")) {
				source.next() // consume "->"
				returnType = Type.Expression.parse(source)
			}
			const body = Block.parse(source)
			result = new FunctionDeclaration(symbol, modifier, typeParameters, argumentList, returnType, body, source.mark())
		}
		return result
	}
}
Statement.addParser(FunctionDeclaration.parse)
