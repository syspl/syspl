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
import * as Tokens from "./"

import Is = Unit.Is
export class IdentifierTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Identifier")
		var errorHandler = new Error.ConsoleHandler()
		this.add("isIdentifier()", () => {
			var identifier1 = new Tokens.Identifier(null, null)
			var identifier2 = new Tokens.Identifier("bar", null)
			this.expect(identifier1.isIdentifier())
			this.expect(identifier1.isIdentifier(""), Is.True())
			this.expect(identifier1.isIdentifier("foo"), Is.False())
			this.expect(identifier2.isIdentifier())
			this.expect(identifier2.isIdentifier("foo"), Is.False())
		})
		this.add("scan identifier", () => {
			var source = new Tokens.Source(new IO.StringReader("identifier"), errorHandler)
			var token = Tokens.Identifier.scan(source)
			this.expect(token instanceof Tokens.Identifier)
			this.expect(token.isIdentifier())
			this.expect((<Tokens.Identifier>token).getName(), Is.Equal().To("identifier"))
		})
	}
}
Unit.Fixture.add(new IdentifierTest())