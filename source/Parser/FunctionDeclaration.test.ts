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

import { Error, Unit } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

import Is = Unit.Is
export class FunctionDeclarationTest extends Unit.Fixture {
	constructor() {
		super("Parser.FunctionDeclaration")
		const handler = new Error.ConsoleHandler()
		//
		// TODO: Construct a test for an argument list with no explicitly set types (type inference)
		//
		this.add("empty function", () => {
			const functionDeclaration = this.createDeclaration("func empty\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("empty"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty" }))
		})
		this.add("static function", () => {
			const functionDeclaration = this.createDeclaration("static func empty\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.FunctionModifier.Static))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", modifier: "static" }))
		})
		this.add("abstract function", () => {
			const functionDeclaration = this.createDeclaration("abstract func empty\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.FunctionModifier.Abstract))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", modifier: "abstract" }))
		})
		this.add("virtual function", () => {
			const functionDeclaration = this.createDeclaration("virtual func empty\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.FunctionModifier.Virtual))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", modifier: "virtual" }))
		})
		this.add("override function", () => {
			const functionDeclaration = this.createDeclaration("override func empty\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.FunctionModifier.Override))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", modifier: "override" }))
		})
		this.add("empty function with parameters", () => {
			const functionDeclaration = this.createDeclaration("func empty(i: Int, j: Float, k: Double)\n", handler)
			const functionArguments = functionDeclaration.argumentList
			let currentArgument: SyntaxTree.ArgumentDeclaration
			this.expect(functionDeclaration.symbol, Is.equal.to("empty"))
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("i"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("j"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("k"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Double"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", arguments: [
				{ class: "argumentDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int" } },
				{ class: "argumentDeclaration", symbol: "j", type: { class: "type.identifier", name: "Float" } },
				{ class: "argumentDeclaration", symbol: "k", type: { class: "type.identifier", name: "Double" } },
			] }))
		})
		this.add("empty function with interfered argument types", () => {
			const functionDeclaration = this.createDeclaration("func empty(w, h: Int, x, y, z: Float)\n", handler)
			const functionArguments = functionDeclaration.argumentList
			let currentArgument: SyntaxTree.ArgumentDeclaration
			this.expect(functionDeclaration.symbol, Is.equal.to("empty"))
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("w"))
			this.expect(currentArgument.type, Is.undefined)
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("h"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("x"))
			this.expect(currentArgument.type, Is.undefined)
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("y"))
			this.expect(currentArgument.type, Is.undefined)
			currentArgument = functionArguments.next()!
			this.expect(currentArgument.symbol, Is.equal.to("z"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", arguments: [
				{ class: "argumentDeclaration", symbol: "w" },
				{ class: "argumentDeclaration", symbol: "h", type: { class: "type.identifier", name: "Int" } },
				{ class: "argumentDeclaration", symbol: "x" },
				{ class: "argumentDeclaration", symbol: "y" },
				{ class: "argumentDeclaration", symbol: "z", type: { class: "type.identifier", name: "Float" } },
			] }))
		})
		this.add("empty generic function with generic parameter types", () => {
			const functionDeclaration = this.createDeclaration("func empty<T, S>(a, b: Generic<T>, x, y: Generic<S>)\n", handler)
			const parameters = functionDeclaration.parameters
			this.expect(parameters.next()!.name, Is.equal.to("T"))
			this.expect(parameters.next()!.name, Is.equal.to("S"))
			const functionArguments = functionDeclaration.argumentList
			let currentArgument = functionArguments.next()! // a
			this.expect(currentArgument.type, Is.undefined)
			currentArgument = functionArguments.next()! // b
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).parameters.next()!.name, Is.equal.to("T"))
			currentArgument = functionArguments.next()! // x
			this.expect(currentArgument.type, Is.undefined)
			currentArgument = functionArguments.next()! // y
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).parameters.next()!.name, Is.equal.to("S"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({
				class: "functionDeclaration", symbol: "empty",
				parameters: [
					{ class: "type.name", name: "T" },
					{ class: "type.name", name: "S" },
				],
				arguments: [
				{ class: "argumentDeclaration", symbol: "a" },
				{ class: "argumentDeclaration", symbol: "b", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "T" }]} },
				{ class: "argumentDeclaration", symbol: "x" },
				{ class: "argumentDeclaration", symbol: "y", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "S" }] } },
			] }))
		})
		this.add("empty function with return type", () => {
			const functionDeclaration = this.createDeclaration("func empty -> ReturnType\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("empty"))
			this.expect((functionDeclaration.returnType as SyntaxTree.Type.Identifier).name, Is.equal.to("ReturnType"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({ class: "functionDeclaration", symbol: "empty", returnType: { class: "type.identifier", name: "ReturnType" } }))
		})
		this.add("empty function with return type tuple", () => {
			const functionDeclaration = this.createDeclaration("func empty -> (Int, Float, Double)\n", handler)
			const tupleChildren = (functionDeclaration.returnType as SyntaxTree.Type.Tuple).elements
			this.expect(functionDeclaration.symbol, Is.equal.to("empty"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Double"))
			this.expect(functionDeclaration.serialize(), Is.equal.to({
				class: "functionDeclaration", symbol: "empty", returnType: {
					class: "type.tuple",
					elements: [
						{ class: "type.identifier", name: "Int" },
						{ class: "type.identifier", name: "Float" },
						{ class: "type.identifier", name: "Double" },
					],
				},
			}))
		})
	}
	createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.FunctionDeclaration {
		return Parser.parseFirst(sourceString, handler) as SyntaxTree.FunctionDeclaration
	}
}
Unit.Fixture.add(new FunctionDeclarationTest())
