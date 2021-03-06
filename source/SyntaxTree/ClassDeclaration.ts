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
import * as Tokens from "../Tokens"
import { TypeDeclaration } from "./TypeDeclaration"
import * as Type from "./Type"
import { Block } from "./Block"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class ClassDeclaration extends TypeDeclaration {
	get class() { return "classDeclaration" }
	readonly implements: Utilities.Enumerable<Type.Identifier>
	constructor(symbol: string, readonly isAbstract: boolean, readonly parameters: Utilities.Enumerable<Type.Name>, readonly extended: Type.Identifier | undefined, implemented: Utilities.Enumerable<Type.Identifier>, readonly content: Block, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, tokens)
		this.implements = implemented
	}
	serialize(): { class: string } & any {
		const parameters = this.parameters.map(t => t.serialize()).toArray()
		const implemented = this.implements.map(i => i.serialize()).toArray()
		return {
			...super.serialize(),
			isAbstract: this.isAbstract || undefined,
			parameters: parameters.length > 0 ? parameters : undefined,
			extends: this.extended && this.extended.serialize(),
			implements: implemented.length > 0 ? implemented : undefined,
			content: this.content.serialize(),
		}
	}
}
addDeserializer("classDeclaration", data =>
	data.hasOwnProperty("name") && data.hasOwnProperty("content") ?
	new ClassDeclaration(data.name, data.isAbstract, deserialize<Type.Name>(data.parameters as ({ class: string } & any)[]), deserialize<Type.Identifier>(data.extends), deserialize<Type.Identifier>(data.implements as ({ class: string } & any)[]), deserialize<Block>(data.content)!) :
	undefined)
