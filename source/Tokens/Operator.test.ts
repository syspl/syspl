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

import { Error, IO } from "@cogneco/mend"
import * as Tokens from "./"

describe("Tokens.Operator", () => {
	const errorHandler = new Error.ConsoleHandler()
	it("isOperator()", () => {
		const operator1 = new Tokens.Operator("")
		const operator2 = new Tokens.Operator(">")
		expect(operator1.isOperator()).toBeTruthy()
		expect(operator1.isOperator("")).toBeTruthy()
		expect(operator1.isOperator("+")).toBeFalsy()
		expect(operator2.isOperator()).toBeTruthy()
		expect(operator2.isOperator(">")).toBeTruthy()
		expect(operator2.isOperator("+")).toBeFalsy()
	})
	it("scan operator", () => {
		const source = new Tokens.Source(IO.StringReader.create("<==>"), errorHandler)
		const token = Tokens.Operator.scan(source)!
		expect(token instanceof Tokens.Operator).toBeTruthy()
		expect(token.isOperator()).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("<==>")
		expect(token.serialize()).toEqual({ class: "operator", symbol: "<==>" })
	})
	it("arithmetic", () => {
		const source = new Tokens.Source(IO.StringReader.create("+-*/**%++***"), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("+")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "+" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("-")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "-" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("*")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "*" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("/")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "/" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("**")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "**" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("%")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "%" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("++")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "++" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("**")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "**" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("*")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "*" })
	})
	it("binary/bitwise and logical", () => {
		const source = new Tokens.Source(IO.StringReader.create("<<>>^&|||&&??"), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("<<")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "<<" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual(">>")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ">>" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("^")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "^" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("&")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "&" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("||")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "||" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("|")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "|" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("&&")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "&&" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("??")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "??" })
	})
	it("assignment", () => {
		const source = new Tokens.Source(IO.StringReader.create("=-=*=/=**=%=<<=>>=^=&=|=:=::="), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("-=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "-=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("*=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "*=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("/=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "/=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("**=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "**=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("%=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "%=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("<<=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "<<=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual(">>=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ">>=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("^=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "^=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("&=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "&=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("|=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "|=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual(":=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ":=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("::=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "::=" })
	})
	it("comparison", () => {
		const source = new Tokens.Source(IO.StringReader.create("==<><=:==<==>>=!="), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("==")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "==" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("<")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "<" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual(">")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ">" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("<=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "<=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual(":==")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ":==" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("<==>")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "<==>" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual(">=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ">=" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("!=")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "!=" })
	})
	it("unary", () => {
		const source = new Tokens.Source(IO.StringReader.create("!@~--?++"), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("!")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "!" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("@")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "@" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("~")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "~" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("--")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "--" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("?")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "?" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("++")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "++" })
	})
	it("misfits", () => {
		const source = new Tokens.Source(IO.StringReader.create("..->=>..."), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("..")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: ".." })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("->")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "->" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("=>")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "=>" })
		expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
		expect((token as Tokens.Operator).symbol).toEqual("...")
		expect(token!.serialize()).toEqual({ class: "operator", symbol: "..." })
	})
})
