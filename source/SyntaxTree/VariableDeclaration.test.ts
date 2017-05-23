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

import { Error, IO, Unit } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import * as SyntaxTree from "./"

import Is = Unit.Is
export class VariableDeclarationTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.VariableDeclaration")
		const handler = new Error.ConsoleHandler()
		this.add("simple declaration", () => {
			const variableDeclaration = this.createDeclaration("var i: Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
		})
		this.add("static variable", () => {
			const variableDeclaration = this.createDeclaration("static var i: Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isStatic, Is.true)
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
		})
		this.add("constant", () => {
			const variableDeclaration = this.createDeclaration("let i: Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isConstant, Is.true)
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
		})
		this.add("static const", () => {
			const variableDeclaration = this.createDeclaration("static let i: Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isStatic, Is.true)
			this.expect(variableDeclaration.isConstant, Is.true)
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
		})
		this.add("var a = b", () => {
			const variableDeclaration = SyntaxTree.Parser.parseFirst("var a = b", handler) as SyntaxTree.VariableDeclaration
			this.expect(variableDeclaration.symbol, Is.equal.to("a"))
			this.expect((variableDeclaration.value as SyntaxTree.Expressions.Identifier).name, Is.equal.to("b"))
		})
		this.add("var foo: Type = bar", () => {
			const variableDeclaration = SyntaxTree.Parser.parseFirst("var foo: Type = bar", handler) as SyntaxTree.VariableDeclaration
			this.expect(variableDeclaration.symbol, Is.equal.to("foo"))
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Type"))
			this.expect((variableDeclaration.value as SyntaxTree.Expressions.Identifier).name, Is.equal.to("bar"))
		})
		this.add("var foo: Float = 0.50f", () => {
			const variableDeclaration = SyntaxTree.Parser.parseFirst("var f: Float = 0.50f", handler) as SyntaxTree.VariableDeclaration
			this.expect(variableDeclaration.symbol, Is.equal.to("f"))
			this.expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			this.expect((variableDeclaration.value as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(0.5))
		})	}
	createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.VariableDeclaration {
		return SyntaxTree.Parser.parseFirst(sourceString, handler) as SyntaxTree.VariableDeclaration
	}
}
Unit.Fixture.add(new VariableDeclarationTest())