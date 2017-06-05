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

import * as Tokens from "../Tokens"
import { Source } from "./Source"
import * as Statement from "./Statement"
import * as Declaration from "./Declaration"
import * as Type from "./Type"
import * as ArgumentDeclaration from "./ArgumentDeclaration"
import * as Block from "./Block"
import * as SyntaxTree from "../SyntaxTree"

function parseModifier(modifier: string): SyntaxTree.FunctionModifier {
	let result: SyntaxTree.FunctionModifier
	switch (modifier) {
		case "abstract": result = SyntaxTree.FunctionModifier.Abstract; break
		default: result = SyntaxTree.FunctionModifier.None; break
		case "override": result = SyntaxTree.FunctionModifier.Override; break
		case "static": result = SyntaxTree.FunctionModifier.Static; break
		case "virtual": result = SyntaxTree.FunctionModifier.Virtual; break
	}
	return result
}
export function parse(source: Source): SyntaxTree.FunctionDeclaration | undefined {
	let result: SyntaxTree.FunctionDeclaration | undefined
	const modifier = parseModifier((source.peek() as Tokens.Identifier).name)
	if (source.peek(modifier == SyntaxTree.FunctionModifier.None ? 0 : 1)!.isIdentifier("func") && source.next() && (modifier == SyntaxTree.FunctionModifier.None || source.next())) {
		const symbol = Type.Name.parse(source.clone())
		if (!symbol)
			source.raise("Expected symbol in function declaration.")
		// TODO: add overload name parsing: ~overloadName
		const typeParameters = Declaration.parseTypeParameters(source.clone())
		const argumentList = ArgumentDeclaration.parseAll(source.clone())
		let returnType: SyntaxTree.Type.Expression | undefined
		if (source.peek()!.isOperator("->")) {
			source.next() // consume "->"
			returnType = Type.parse(source)
		}
		const body = Block.parse(source)
		result = new SyntaxTree.FunctionDeclaration(symbol!, modifier, typeParameters, argumentList, returnType, body, source.mark())
	}
	return result
}
Statement.addParser(parse)
